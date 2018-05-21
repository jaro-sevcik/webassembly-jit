import * as Wasm from "./webassembly-jit";

test("run_get_constant", () => {
    const builder = new Wasm.ModuleBuilder();
    builder.addType(Wasm.kSig_i_v);
    builder.addFunction("main", Wasm.kSig_i_v)
      .addBody([
        Wasm.kExprI32Const, 11])   // --
      .exportAs("main");

    const i = builder.instantiate();

    expect(i.exports.main()).toBe(11);
});

test("run_store_load", () => {
    const builder = new Wasm.ModuleBuilder();

    builder.addMemory(1, 1, false);

    builder.addType(Wasm.kSig_i_ii);
    builder.addFunction("store", Wasm.kSig_v_ii)
        .addBody([
            Wasm.kExprGetLocal, 0,         // --
            Wasm.kExprGetLocal, 1,         // --
            Wasm.kExprI32StoreMem, 0, 0])  // --
      .exportAs("store");

    builder.addFunction("load", Wasm.kSig_i_i)
      .addBody([
        Wasm.kExprGetLocal, 0,        // --
        Wasm.kExprI32LoadMem, 0, 0])  // --
      .exportAs("load");

    const i = builder.instantiate();

    i.exports.store(4, 11);

    expect(i.exports.load(4)).toBe(11);
});

test("run_store_load_export_import_memory", () => {
    let i1;
    {
        const builder = new Wasm.ModuleBuilder();
        builder.addMemory(1, 1, false);
        builder.exportMemoryAs("exported_mem");
        builder.addType(Wasm.kSig_i_ii);
        builder.addFunction("store", Wasm.kSig_v_ii)
            .addBody([
                Wasm.kExprGetLocal, 0,         // --
                Wasm.kExprGetLocal, 1,         // --
                Wasm.kExprI32StoreMem, 0, 0])  // --
        .exportAs("store");
        i1 = builder.instantiate();
    }

    let i2;
    {
        const builder = new Wasm.ModuleBuilder();
        builder.addImportedMemory("I", "imported_mem");
        builder.addType(Wasm.kSig_i_ii);
        builder.addFunction("load", Wasm.kSig_i_i)
            .addBody([
                Wasm.kExprGetLocal, 0,        // --
                Wasm.kExprI32LoadMem, 0, 0])  // --
            .exportAs("load");
        i2 = builder.instantiate(
            { I : { imported_mem : i1.exports.exported_mem}});
    }

    i1.exports.store(4, 11);

    expect(i2.exports.load(4)).toBe(11);
});

test("run_indirect_call_two_modules", () => {
    const kTableSize = 3;
    const kTableZero = 0;

    // Instance {i1} defines the table and exports it.
    let i1;
    let sig_index1;
    {
        const builder = new Wasm.ModuleBuilder();
        builder.addType(Wasm.kSig_i_i);
        builder.addType(Wasm.kSig_i_ii);
        sig_index1 = builder.addType(Wasm.kSig_i_v);
        const f1 = builder.addFunction("f1", sig_index1)
        .addBody([Wasm.kExprI32Const, 11]);

        builder.addFunction("main", Wasm.kSig_i_i)
        .addBody([
            Wasm.kExprGetLocal, 0,   // --
            Wasm.kExprCallIndirect, sig_index1, kTableZero])  // --
        .exportAs("main");

        builder.setFunctionTableBounds(kTableSize, kTableSize);
        builder.addFunctionTableInit(0, false, [f1.index]);
        builder.addExportOfKind("table", Wasm.kExternalTable, 0);

        i1 = builder.instantiate();
    }

    // Instance {i2} imports the table and adds {f2}.
    let i2;
    let sig_index2;
    {
        const builder = new Wasm.ModuleBuilder();
        builder.addType(Wasm.kSig_i_ii);
        sig_index2 = builder.addType(Wasm.kSig_i_v);
        const f2 = builder.addFunction("f2", sig_index2)
        .addBody([Wasm.kExprI32Const, 22]);

        builder.addFunction("main", Wasm.kSig_i_i)
        .addBody([
            Wasm.kExprGetLocal, 0,   // --
            Wasm.kExprCallIndirect, sig_index2, kTableZero])  // --
        .exportAs("main");

        builder.addImportedTable("z", "table", kTableSize, kTableSize);
        builder.addFunctionTableInit(1, false, [f2.index], true);

        i2 = builder.instantiate({z: {table: i1.exports.table}});
    }

    expect(sig_index1).not.toBe(sig_index2);

    expect(i1.exports.main(0)).toBe(11);
    expect(i2.exports.main(0)).toBe(11);
    expect(i1.exports.main(1)).toBe(22);
    expect(i2.exports.main(1)).toBe(22);
});
