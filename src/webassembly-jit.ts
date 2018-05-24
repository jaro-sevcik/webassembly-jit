// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// V8 internal constants
export const kV8MaxPages = 32767;

// Header declaration constants
export const kWasmH0 = 0;
export const kWasmH1 = 0x61;
export const kWasmH2 = 0x73;
export const kWasmH3 = 0x6d;

export const kWasmV0 = 0x1;
export const kWasmV1 = 0;
export const kWasmV2 = 0;
export const kWasmV3 = 0;

export const kHeaderSize = 8;
export const kPageSize = 65536;
export const kSpecMaxPages = 65535;

function bytesWithHeader() : ArrayBuffer {
    const buffer = new ArrayBuffer(kHeaderSize + arguments.length);
    const view = new Uint8Array(buffer);
    view[0] = kWasmH0;
    view[1] = kWasmH1;
    view[2] = kWasmH2;
    view[3] = kWasmH3;
    view[4] = kWasmV0;
    view[5] = kWasmV1;
    view[6] = kWasmV2;
    view[7] = kWasmV3;
    for (let i = 0; i < arguments.length; i++) {
        let val = arguments[i];
        if ((typeof val) === "string") val = val.charCodeAt(0);
        view[kHeaderSize + i] = val | 0;
    }
    return buffer;
}

// Section declaration constants
enum SectionCode {
    kUnknown = 0,
    kType = 1,        // Function signature declarations
    kImport = 2,      // Import declarations
    kFunction = 3,    // Function declarations
    kTable = 4,       // Indirect function table and other tables
    kMemory = 5,      // Memory attributes
    kGlobal = 6,      // Global declarations
    kExport = 7,      // Exports
    kStart = 8,       // Start function declaration
    kElement = 9,     // Elements section
    kCode = 10,       // Function code
    kData = 11,       // Data segments
    kName = 12,       // Name section (encoded as string)
    kException = 13,  // Exception section (must appear
                      // before code section)
}

// Name section types
enum NameCode {
    kModule = 0,
    kFunctions = 1,
    kLocals = 2,
}

const kWasmFunctionTypeForm = 0x60;
const kWasmAnyFunctionTypeForm = 0x70;

// Local types
export enum Type {
    kStmt = 0x40,
    kI32 = 0x7f,
    kI64 = 0x7e,
    kF32 = 0x7d,
    kF64 = 0x7c,
    kS128 = 0x7b,
    kAnyRef = 0x6f,
}

export const kExternalFunction = 0;
export const kExternalTable = 1;
export const kExternalMemory = 2;
export const kExternalGlobal = 3;

export const kTableZero = 0;
export const kMemoryZero = 0;

// Useful signatures
export const kSig_i_i = makeSig([Type.kI32], [Type.kI32]);
export const kSig_l_l = makeSig([Type.kI64], [Type.kI64]);
export const kSig_i_l = makeSig([Type.kI64], [Type.kI32]);
export const kSig_i_ii = makeSig([Type.kI32, Type.kI32], [Type.kI32]);
export const kSig_i_iii = makeSig(
    [Type.kI32, Type.kI32, Type.kI32], [Type.kI32]);
export const kSig_d_dd = makeSig([Type.kF64, Type.kF64], [Type.kF64]);
export const kSig_l_ll = makeSig([Type.kI64, Type.kI64], [Type.kI64]);
export const kSig_i_dd = makeSig([Type.kF64, Type.kF64], [Type.kI32]);
export const kSig_v_v = makeSig([], []);
export const kSig_i_v = makeSig([], [Type.kI32]);
export const kSig_l_v = makeSig([], [Type.kI64]);
export const kSig_f_v = makeSig([], [Type.kF32]);
export const kSig_d_v = makeSig([], [Type.kF64]);
export const kSig_v_i = makeSig([Type.kI32], []);
export const kSig_v_ii = makeSig([Type.kI32, Type.kI32], []);
export const kSig_v_iii = makeSig([Type.kI32, Type.kI32, Type.kI32], []);
export const kSig_v_l = makeSig([Type.kI64], []);
export const kSig_v_d = makeSig([Type.kF64], []);
export const kSig_v_dd = makeSig([Type.kF64, Type.kF64], []);
export const kSig_v_ddi = makeSig([Type.kF64, Type.kF64, Type.kI32], []);
export const kSig_ii_v = makeSig([], [Type.kI32, Type.kI32]);
export const kSig_iii_v = makeSig([], [Type.kI32, Type.kI32, Type.kI32]);
export const kSig_ii_i = makeSig([Type.kI32], [Type.kI32, Type.kI32]);
export const kSig_iii_i = makeSig(
    [Type.kI32], [Type.kI32, Type.kI32, Type.kI32]);
export const kSig_ii_ii = makeSig(
    [Type.kI32, Type.kI32], [Type.kI32, Type.kI32]);
export const kSig_iii_ii = makeSig(
    [Type.kI32, Type.kI32], [Type.kI32, Type.kI32, Type.kI32]);

export const kSig_v_f = makeSig([Type.kF32], []);
export const kSig_f_f = makeSig([Type.kF32], [Type.kF32]);
export const kSig_d_d = makeSig([Type.kF64], [Type.kF64]);
export const kSig_r_r = makeSig([Type.kAnyRef], [Type.kAnyRef]);
export const kSig_i_r = makeSig([Type.kAnyRef], [Type.kI32]);
export const kSig_v_r = makeSig([Type.kAnyRef], []);
export const kSig_r_v = makeSig([], [Type.kAnyRef]);

export interface ISignature {
    params : Type[];
    results : Type[];
}

export function makeSig(params : Type[], results : Type[]) : ISignature {
    return { params : params, results : results };
}

function makeSig_v_x(x : Type) : ISignature {
    return makeSig([x], []);
}

function makeSig_v_xx(x : Type) : ISignature {
    return makeSig([x, x], []);
}

function makeSig_r_v(r : Type) : ISignature {
    return makeSig([], [r]);
}

function makeSig_r_x(r : Type, x : Type) : ISignature {
    return makeSig([x], [r]);
}

function makeSig_r_xx(r : Type, x : Type) : ISignature {
    return makeSig([x, x], [r]);
}

export enum Opcode {
    kUnreachable = 0x00,
    kNop = 0x01,
    kBlock = 0x02,
    kLoop = 0x03,
    kIf = 0x04,
    kElse = 0x05,
    kTry = 0x06,
    kCatch = 0x07,
    kThrow = 0x08,
    kEnd = 0x0b,
    kBr = 0x0c,
    kBrIf = 0x0d,
    kBrTable = 0x0e,
    kReturn = 0x0f,
    kCallFunction = 0x10,
    kCallIndirect = 0x11,
    kDrop = 0x1a,
    kSelect = 0x1b,
    kGetLocal = 0x20,
    kSetLocal = 0x21,
    kTeeLocal = 0x22,
    kGetGlobal = 0x23,
    kSetGlobal = 0x24,
    kI32Const = 0x41,
    kI64Const = 0x42,
    kF32Const = 0x43,
    kF64Const = 0x44,
    kRefNull = 0xd0,
    kI32Load = 0x28,
    kI64Load = 0x29,
    kF32Load = 0x2a,
    kF64Load = 0x2b,
    kI32Load8S = 0x2c,
    kI32Load8U = 0x2d,
    kI32Load16S = 0x2e,
    kI32Load16U = 0x2f,
    kI64Load8S = 0x30,
    kI64Load8U = 0x31,
    kI64Load16S = 0x32,
    kI64Load16U = 0x33,
    kI64Load32S = 0x34,
    kI64Load32U = 0x35,
    kI32Store = 0x36,
    kI64Store = 0x37,
    kF32Store = 0x38,
    kF64Store = 0x39,
    kI32Store8 = 0x3a,
    kI32Store16 = 0x3b,
    kI64Store8 = 0x3c,
    kI64Store16 = 0x3d,
    kI64Store32 = 0x3e,
    kMemSize = 0x3f,
    kMemGrow = 0x40,
    kI32Eqz = 0x45,
    kI32Eq = 0x46,
    kI32Ne = 0x47,
    kI32LtS = 0x48,
    kI32LtU = 0x49,
    kI32GtS = 0x4a,
    kI32GtU = 0x4b,
    kI32LeS = 0x4c,
    kI32LeU = 0x4d,
    kI32GeS = 0x4e,
    kI32GeU = 0x4f,
    kI64Eqz = 0x50,
    kI64Eq = 0x51,
    kI64Ne = 0x52,
    kI64LtS = 0x53,
    kI64LtU = 0x54,
    kI64GtS = 0x55,
    kI64GtU = 0x56,
    kI64LeS = 0x57,
    kI64LeU = 0x58,
    kI64GeS = 0x59,
    kI64GeU = 0x5a,
    kF32Eq = 0x5b,
    kF32Ne = 0x5c,
    kF32Lt = 0x5d,
    kF32Gt = 0x5e,
    kF32Le = 0x5f,
    kF32Ge = 0x60,
    kF64Eq = 0x61,
    kF64Ne = 0x62,
    kF64Lt = 0x63,
    kF64Gt = 0x64,
    kF64Le = 0x65,
    kF64Ge = 0x66,
    kRefIsNull = 0xd1,
    kI32Clz = 0x67,
    kI32Ctz = 0x68,
    kI32Popcnt = 0x69,
    kI32Add = 0x6a,
    kI32Sub = 0x6b,
    kI32Mul = 0x6c,
    kI32DivS = 0x6d,
    kI32DivU = 0x6e,
    kI32RemS = 0x6f,
    kI32RemU = 0x70,
    kI32And = 0x71,
    kI32Ior = 0x72,
    kI32Xor = 0x73,
    kI32Shl = 0x74,
    kI32ShrS = 0x75,
    kI32ShrU = 0x76,
    kI32Rol = 0x77,
    kI32Ror = 0x78,
    kI64Clz = 0x79,
    kI64Ctz = 0x7a,
    kI64Popcnt = 0x7b,
    kI64Add = 0x7c,
    kI64Sub = 0x7d,
    kI64Mul = 0x7e,
    kI64DivS = 0x7f,
    kI64DivU = 0x80,
    kI64RemS = 0x81,
    kI64RemU = 0x82,
    kI64And = 0x83,
    kI64Ior = 0x84,
    kI64Xor = 0x85,
    kI64Shl = 0x86,
    kI64ShrS = 0x87,
    kI64ShrU = 0x88,
    kI64Rol = 0x89,
    kI64Ror = 0x8a,
    kF32Abs = 0x8b,
    kF32Neg = 0x8c,
    kF32Ceil = 0x8d,
    kF32Floor = 0x8e,
    kF32Trunc = 0x8f,
    kF32Nearest = 0x90,
    kF32Sqrt = 0x91,
    kF32Add = 0x92,
    kF32Sub = 0x93,
    kF32Mul = 0x94,
    kF32Div = 0x95,
    kF32Min = 0x96,
    kF32Max = 0x97,
    kF32Copysign = 0x98,
    kF64Abs = 0x99,
    kF64Neg = 0x9a,
    kF64Ceil = 0x9b,
    kF64Floor = 0x9c,
    kF64Trunc = 0x9d,
    kF64Nearest = 0x9e,
    kF64Sqrt = 0x9f,
    kF64Add = 0xa0,
    kF64Sub = 0xa1,
    kF64Mul = 0xa2,
    kF64Div = 0xa3,
    kF64Min = 0xa4,
    kF64Max = 0xa5,
    kF64Copysign = 0xa6,
    kI32ConvertI64 = 0xa7,
    kI32ConvertF32S = 0xa8,
    kI32ConvertF32U = 0xa9,
    kI32ConvertF64S = 0xaa,
    kI32ConvertF64U = 0xab,
    kI64ConvertI32S = 0xac,
    kI64ConvertI32U = 0xad,
    kI64ConvertF32S = 0xae,
    kI64ConvertF32U = 0xaf,
    kI64ConvertF64S = 0xb0,
    kI64ConvertF64U = 0xb1,
    kF32ConvertI32S = 0xb2,
    kF32ConvertI32U = 0xb3,
    kF32ConvertI64S = 0xb4,
    kF32ConvertI64U = 0xb5,
    kF32ConvertF64 = 0xb6,
    kF64ConvertI32S = 0xb7,
    kF64ConvertI32U = 0xb8,
    kF64ConvertI64S = 0xb9,
    kF64ConvertI64U = 0xba,
    kF64ConvertF32 = 0xbb,
    kI32ReinterpretF32 = 0xbc,
    kI64ReinterpretF64 = 0xbd,
    kF32ReinterpretI32 = 0xbe,
    kF64ReinterpretI64 = 0xbf,
    kAtomicPrefix = 0xfe,
}

// Prefix opcodes
export enum AtomicOpcode {
    kI32AtomicLoad = 0x10,
    kI32AtomicLoad8U = 0x12,
    kI32AtomicLoad16U = 0x13,
    kI32AtomicStore = 0x17,
    kI32AtomicStore8U = 0x19,
    kI32AtomicStore16U = 0x1a,
    kI32AtomicAdd = 0x1e,
    kI32AtomicAdd8U = 0x20,
    kI32AtomicAdd16U = 0x21,
    kI32AtomicSub = 0x25,
    kI32AtomicSub8U = 0x27,
    kI32AtomicSub16U = 0x28,
    kI32AtomicAnd = 0x2c,
    kI32AtomicAnd8U = 0x2e,
    kI32AtomicAnd16U = 0x2f,
    kI32AtomicOr = 0x33,
    kI32AtomicOr8U = 0x35,
    kI32AtomicOr16U = 0x36,
    kI32AtomicXor = 0x3a,
    kI32AtomicXor8U = 0x3c,
    kI32AtomicXor16U = 0x3d,
    kI32AtomicExchange = 0x41,
    kI32AtomicExchange8U = 0x43,
    kI32AtomicExchange16U = 0x44,
    kI32AtomicCompareExchange = 0x48,
    kI32AtomicCompareExchange8U = 0x4a,
    kI32AtomicCompareExchange16U = 0x4b,
}

export const kTrapUnreachable = 0;
export const kTrapMemOutOfBounds = 1;
export const kTrapDivByZero = 2;
export const kTrapDivUnrepresentable = 3;
export const kTrapRemByZero = 4;
export const kTrapFloatUnrepresentable = 5;
export const kTrapFuncInvalid = 6;
export const kTrapFuncSigMismatch = 7;
export const kTrapTypeError = 8;


function wasmI32Const(val : number) {
    const bytes = [Opcode.kI32Const];
    for (let i = 0; i < 4; ++i) {
        bytes.push(0x80 | ((val >> (7 * i)) & 0x7f));
    }
    bytes.push((val >> (7 * 4)) & 0x7f);
    return bytes;
}

function wasmF32Const(f : number) {
    return [Opcode.kF32Const].concat(
        Array.from(new Uint8Array((new Float32Array([f])).buffer)));
}

function wasmF64Const(f : number) {
    return [Opcode.kF64Const].concat(
        Array.from(new Uint8Array((new Float64Array([f])).buffer)));
}

// Used for encoding f32 and double constants to bits.
const __buffer = new ArrayBuffer(8);
const byte_view = new Int8Array(__buffer);
const f32_view = new Float32Array(__buffer);
const f64_view = new Float64Array(__buffer);

export class Binary {
    bytes : number[] = [];

    push(val : number) {
        this.bytes.push(val);
    }

    emit_u8(val : number) {
        this.push(val);
    }

    emit_u16(val : number) {
        this.push(val & 0xff);
        this.push((val >> 8) & 0xff);
    }

    emit_u32(val : number) {
        this.push(val & 0xff);
        this.push((val >> 8) & 0xff);
        this.push((val >> 16) & 0xff);
        this.push((val >> 24) & 0xff);
    }

    emit_u32v(val : number) {
        while (true) {
            const v = val & 0xff;
            val = val >>> 7;
            if (val === 0) {
                this.push(v);
                break;
            }
            this.push(v | 0x80);
        }
    }

    emit_bytes(data : number[]) {
        for (const v of data) {
            this.push(v & 0xff);
        }
    }

    emit_string(s : string | number[]) {
        // When testing illegal names, we pass a byte array directly.
        if (s instanceof Array) {
            this.emit_u32v(s.length);
            this.emit_bytes(s);
            return;
        }

        // This is the hacky way to convert a JavaScript string to
        // a UTF8 encoded string only containing single-byte characters.
        const string_utf8 = unescape(encodeURIComponent(s));
        this.emit_u32v(string_utf8.length);
        for (let i = 0; i < string_utf8.length; i++) {
            this.emit_u8(string_utf8.charCodeAt(i));
        }
    }

    emit_header() {
        this.emit_bytes([kWasmH0, kWasmH1, kWasmH2, kWasmH3,
            kWasmV0, kWasmV1, kWasmV2, kWasmV3]);
    }

    emit_section(section_code : number,
                 content_generator : (b : Binary) => void) {
        // Emit section name.
        this.emit_u8(section_code);
        // Emit the section to a temporary buffer: its full length isn't
        // known yet.
        const section = new Binary();
        content_generator(section);
        // Emit section length.
        this.emit_u32v(section.bytes.length);
        // Copy the temporary buffer.
        for (const b of section.bytes) {
            this.push(b);
        }
    }
}

export interface ILocalsCounts {
    i32_count : number;
    i64_count : number;
    f32_count : number;
    f64_count : number;
    s128_count : number;
}

export class FunctionBuilder {
    module : any;
    name : string;
    type_index : number;
    body : number[];
    locals : ILocalsCounts[];
    local_names : string[];
    index : number = -1;

    constructor(module : any, name : string, type_index : number) {
        this.module = module;
        this.name = name;
        this.type_index = type_index;
        this.body = [];
        this.local_names = [];
        this.locals = [];
    }

    numLocalNames() {
        if (this.local_names === undefined) return 0;
        let num_local_names = 0;
        for (const loc_name of this.local_names) {
            if (loc_name !== undefined)++num_local_names;
        }
        return num_local_names;
    }

    exportAs(name : string) {
        this.module.addExport(name, this.index);
        return this;
    }

    exportFunc() {
        this.exportAs(this.name);
        return this;
    }

    addBody(body : number[]) {
        for (const b of body) {
            if (typeof b !== "number" || (b & (~0xFF)) !== 0) {
                throw new Error(
                    "invalid body (entries must be 8 bit numbers): " + body);
            }
        }
        this.body = body.slice();
        // Automatically add the end for the function block to the body.
        this.body.push(Opcode.kEnd);
        return this;
    }

    addBodyWithEnd(body : number[]) {
        this.body = body;
        return this;
    }

    getNumLocals() {
        let total_locals = 0;
        for (const l of this.locals || []) {
            total_locals += l.i32_count;
            total_locals += l.i64_count;
            total_locals += l.f32_count;
            total_locals += l.f64_count;
            total_locals += l.s128_count;
        }
        return total_locals;
    }

    addLocals(locals : ILocalsCounts, names : string[]) {
        const old_num_locals = this.getNumLocals();
        if (!this.locals) this.locals = [];
        this.locals.push(locals);
        if (names) {
            if (!this.local_names) this.local_names = [];
            const missing_names = old_num_locals - this.local_names.length;
            this.local_names.push(...new Array(missing_names), ...names);
        }
        return this;
    }

    end() {
        return this.module;
    }
}

// class WasmGlobalBuilder {
//     constructor(module, type, mutable) {
//       this.module = module;
//       this.type = type;
//       this.mutable = mutable;
//       this.init = 0;
//     }

//     exportAs(name) {
//       this.module.exports.push({name: name, kind: kExternalGlobal,
//                                 index: this.index});
//       return this;
//     }
// }


export interface IMemory {
    min : number;
    max : number;
    exp : boolean;
    shared? : string;
}

export interface IImportDef {
    module : string;
    name : string;
    kind : number;
    type? : number;
    mutable? : boolean;
    shared? : string;
    maximum? : number;
    initial? : number;
}

export interface IExportDef {
    name : string;
    kind : number;
    index : number;
}

export interface ISegment {
    addr : number;
    data : number[];
    is_global : boolean;
}

export interface IFunctionTableInit {
    base : number;
    is_global : boolean;
    array : number[];
}

export class ModuleBuilder {
    name : string = "";
    start_index : number = -1;
    types : ISignature[] = [];
    memory? : IMemory;
    explicit : number[][] = [];
    exceptions : ISignature[] = [];
    functions : FunctionBuilder[] = [];
    imports : IImportDef[] = [];
    exports : IExportDef[] = [];
    segments : ISegment[] = [];
    function_table_inits : IFunctionTableInit[] = [];

    function_table_length_min : number = 0;
    function_table_length_max : number = 0;

    num_imported_funcs : number = 0;
    num_imported_globals : number = 0;

    constructor() {
        // this.globals = [];
        // this.function_table = [];
        return this;
    }

    addStart(start_index : number) {
        this.start_index = start_index;
        return this;
    }

    addMemory(min : number, max : number, exp : boolean, shared? : string) {
        this.memory = { min : min, max : max, exp : exp, shared : shared };
        return this;
    }

    addExplicitSection(bytes : number[]) {
        this.explicit.push(bytes);
        return this;
    }

    stringToBytes(name : string) : Binary {
        const result = new Binary();
        result.emit_u32v(name.length);
        for (let i = 0; i < name.length; i++) {
            result.emit_u8(name.charCodeAt(i));
        }
        return result;
    }

    addCustomSection(name : string, bytes : number[]) {
        const binaryName = this.stringToBytes(name);
        const length = new Binary();
        length.emit_u32v(name.length + bytes.length);
        this.explicit.push([
            0,
            ...length.bytes,
            ...binaryName.bytes,
            ...bytes]);
    }

    addType(type : ISignature) {
        this.types.push(type);
        const pl = type.params.length;  // should have params
        const rl = type.results.length; // should have results
        return this.types.length - 1;
    }

    // addGlobal(local_type, mutable) {
    //   let glob = new WasmGlobalBuilder(this, local_type, mutable);
    //   glob.index = this.globals.length + this.num_imported_globals;
    //   this.globals.push(glob);
    //   return glob;
    // }

    addException(type : ISignature) {
        if (type.results.length !== 0) {
            throw new Error("Invalid exception signature: " + type);
        }
        this.exceptions.push(type);
        return this.exceptions.length - 1;
    }

    addFunction(name : string, type : number | ISignature) {
        const type_index = (typeof type) === "number" ?
            type as number : this.addType(type as ISignature);
        const func = new FunctionBuilder(this, name, type_index);
        func.index = this.functions.length + this.num_imported_funcs;
        this.functions.push(func);
        return func;
    }

    addImport(module : string = "", name : string,
              type : number | ISignature) {
        const type_index = (typeof type) === "number" ?
            type as number : this.addType(type as ISignature);
        this.imports.push({
            module : module, name : name, kind : kExternalFunction,
            type: type_index,
        });
        return this.num_imported_funcs++;
    }

    addImportedGlobal(module : string = "", name : string,
                      type : number, mutable : boolean = false) {
        const o = {
            module: module, name: name, kind: kExternalGlobal, type: type,
            mutable: mutable,
        };
        this.imports.push(o);
        return this.num_imported_globals++;
    }

    addImportedMemory(module : string = "", name : string,
                      initial : number = 0, maximum? : number,
                      shared? : string) {
        const o = {
            module: module, name: name, kind: kExternalMemory,
            initial: initial, maximum: maximum, shared: shared,
        };
        this.imports.push(o);
        return this;
    }

    addImportedTable(module : string = "", name : string,
                     initial : number, maximum : number) {
        const o = {
            module : module, name : name, kind : kExternalTable,
            initial: initial, maximum: maximum,
        };
        this.imports.push(o);
    }

    addExport(name : string, index : number) {
        this.exports.push(
            { name : name, kind : kExternalFunction, index : index });
        return this;
    }

    addExportOfKind(name : string, kind : number, index : number) {
        this.exports.push({ name: name, kind: kind, index: index });
        return this;
    }

    addDataSegment(addr : number, data : number[], is_global = false) {
        this.segments.push({ addr: addr, data: data, is_global: is_global });
        return this.segments.length - 1;
    }

    exportMemoryAs(name : string) {
        this.exports.push({ name: name, kind: kExternalMemory, index: 0 });
    }

    addFunctionTableInit(base : number, is_global : boolean,
                         array : number[], is_import = false) {
        this.function_table_inits.push({
            base : base, is_global : is_global,
            array : array,
        });
        if (!is_global) {
            const length = base + array.length;
            if (length > this.function_table_length_min && !is_import) {
                this.function_table_length_min = length;
            }
            if (length > this.function_table_length_max && !is_import) {
                this.function_table_length_max = length;
            }
        }
        return this;
    }

    appendToTable(array : number[]) {
        for (const n of array) {
            if (typeof n !== "number") {
                throw new Error(
                    "invalid table (entries have to be numbers): " + array);
            }
        }
        return this.addFunctionTableInit(0, false, array);
    }

    setFunctionTableBounds(min : number, max : number) {
        this.function_table_length_min = min;
        this.function_table_length_max = max;
        return this;
    }

    setName(name : string) {
        this.name = name;
        return this;
    }

    toArray(debug = false) {
        const binary = new Binary();
        const wasm = this;

        // Add header
        binary.emit_header();

        // Add type section
        if (wasm.types.length > 0) {
            if (debug) console.info("emitting types @ " + binary.bytes.length);
            binary.emit_section(SectionCode.kType, (section) => {
                section.emit_u32v(wasm.types.length);
                for (const type of wasm.types) {
                    section.emit_u8(kWasmFunctionTypeForm);
                    section.emit_u32v(type.params.length);
                    for (const param of type.params) {
                        section.emit_u8(param);
                    }
                    section.emit_u32v(type.results.length);
                    for (const result of type.results) {
                        section.emit_u8(result);
                    }
                }
            });
        }

        // Add imports section
        if (wasm.imports.length > 0) {
            if (debug) {
                console.info("emitting imports @ " + binary.bytes.length);
            }
            binary.emit_section(SectionCode.kImport, (section) => {
                section.emit_u32v(wasm.imports.length);
                for (const imp of wasm.imports) {
                    section.emit_string(imp.module);
                    section.emit_string(imp.name || "");
                    section.emit_u8(imp.kind);
                    if (imp.kind === kExternalFunction) {
                        section.emit_u32v(imp.type || 0);
                    } else if (imp.kind === kExternalGlobal) {
                        section.emit_u32v(imp.type || 0);
                        section.emit_u8(imp.mutable ? 1 : 0);
                    } else if (imp.kind === kExternalMemory) {
                        const has_max = (typeof imp.maximum) !== "undefined";
                        const is_shared = (typeof imp.shared) !== "undefined";
                        if (is_shared) {
                            section.emit_u8(has_max ? 3 : 2); // flags
                        } else {
                            section.emit_u8(has_max ? 1 : 0); // flags
                        }
                        section.emit_u32v(imp.initial || 0); // initial
                        if (has_max) {
                            section.emit_u32v(imp.maximum || 0); // maximum
                        }
                    } else if (imp.kind === kExternalTable) {
                        section.emit_u8(kWasmAnyFunctionTypeForm);
                        const has_max = (typeof imp.maximum) !== "undefined";
                        section.emit_u8(has_max ? 1 : 0); // flags
                        section.emit_u32v(imp.initial || 0); // initial
                        if (has_max) {
                            section.emit_u32v(imp.maximum || 0); // maximum
                        }
                    } else {
                        throw new Error(
                            "unknown/unsupported import kind " + imp.kind);
                    }
                }
            });
        }

        // Add functions declarations
        if (wasm.functions.length > 0) {
            if (debug) {
                console.info(
                    "emitting function decls @ " + binary.bytes.length);
            }
            binary.emit_section(SectionCode.kFunction, (section) => {
                section.emit_u32v(wasm.functions.length);
                for (const func of wasm.functions) {
                    section.emit_u32v(func.type_index);
                }
            });
        }

        // Add function_table.
        if (wasm.function_table_length_min > 0) {
            if (debug) console.info("emitting table @ " + binary.bytes.length);
            binary.emit_section(SectionCode.kTable, (section) => {
                section.emit_u8(1);  // one table entry
                section.emit_u8(kWasmAnyFunctionTypeForm);
                // TODO(gdeepti): Cleanup to use optional max flag,
                // fix up tests to set correct initial/maximum values
                section.emit_u32v(1);
                section.emit_u32v(wasm.function_table_length_min);
                section.emit_u32v(wasm.function_table_length_max);
            });
        }

        // Add memory section
        const memory = wasm.memory;
        if (memory !== undefined) {
            if (debug) console.info("emitting memory @ " + binary.bytes.length);
            binary.emit_section(SectionCode.kMemory, (section) => {
                section.emit_u8(1);  // one memory entry
                const has_max = memory.max !== undefined;
                const is_shared = memory.shared !== undefined;
                // Emit flags (bit 0: resizeable max, bit 1: shared memory)
                if (is_shared) {
                    section.emit_u8(has_max ? 3 : 2);
                } else {
                    section.emit_u8(has_max ? 1 : 0);
                }
                section.emit_u32v(memory.min);
                if (has_max) section.emit_u32v(memory.max);
            });
        }

        //   // Add global section.
        //   if (wasm.globals.length > 0) {
        //     if (debug) print ("emitting globals @ " + binary.length);
        //     binary.emit_section(SectionCode.kGlobal, section => {
        //       section.emit_u32v(wasm.globals.length);
        //       for (let global of wasm.globals) {
        //         section.emit_u8(global.type);
        //         section.emit_u8(global.mutable);
        //         if ((typeof global.init_index) == "undefined") {
        //           // Emit a constant initializer.
        //           switch (global.type) {
        //           case kWasmI32:
        //             section.emit_u8(Opcode.kI32Const);
        //             section.emit_u32v(global.init);
        //             break;
        //           case kWasmI64:
        //             section.emit_u8(Opcode.kI64Const);
        //             section.emit_u32v(global.init);
        //             break;
        //           case kWasmF32:
        //             section.emit_u8(Opcode.kF32Const);
        //             f32_view[0] = global.init;
        //             section.emit_u8(byte_view[0]);
        //             section.emit_u8(byte_view[1]);
        //             section.emit_u8(byte_view[2]);
        //             section.emit_u8(byte_view[3]);
        //             break;
        //           case kWasmF64:
        //             section.emit_u8(Opcode.kF64Const);
        //             f64_view[0] = global.init;
        //             section.emit_u8(byte_view[0]);
        //             section.emit_u8(byte_view[1]);
        //             section.emit_u8(byte_view[2]);
        //             section.emit_u8(byte_view[3]);
        //             section.emit_u8(byte_view[4]);
        //             section.emit_u8(byte_view[5]);
        //             section.emit_u8(byte_view[6]);
        //             section.emit_u8(byte_view[7]);
        //             break;
        //           }
        //         } else {
        //           // Emit a global-index initializer.
        //           section.emit_u8(Opcode.kGetGlobal);
        //           section.emit_u32v(global.init_index);
        //         }
        //         section.emit_u8(Opcode.kEnd);  // end of init expression
        //       }
        //     });
        //   }

        // Add export table.
        const mem_export = (wasm.memory !== undefined && wasm.memory.exp);
        const exports_count = wasm.exports.length + (mem_export ? 1 : 0);
        if (exports_count > 0) {
            if (debug) console.log("emitting exports @ " + binary.bytes.length);
            binary.emit_section(SectionCode.kExport, (section) => {
                section.emit_u32v(exports_count);
                for (const exp of wasm.exports) {
                    section.emit_string(exp.name);
                    section.emit_u8(exp.kind);
                    section.emit_u32v(exp.index);
                }
                if (mem_export) {
                    section.emit_string("memory");
                    section.emit_u8(kExternalMemory);
                    section.emit_u8(0);
                }
            });
        }

        // Add start function section.
        if (wasm.start_index >= 0) {
            if (debug) {
                console.info(
                    "emitting start function @ " + binary.bytes.length);
            }
            binary.emit_section(SectionCode.kStart, (section) => {
                section.emit_u32v(wasm.start_index);
            });
        }

        // Add table elements.
        if (wasm.function_table_inits.length > 0) {
            if (debug) console.info("emitting table @ " + binary.bytes.length);
            binary.emit_section(SectionCode.kElement, (section) => {
                const inits = wasm.function_table_inits;
                section.emit_u32v(inits.length);

                for (const init of inits) {
                    section.emit_u8(0); // table index
                    if (init.is_global) {
                        section.emit_u8(Opcode.kGetGlobal);
                    } else {
                        section.emit_u8(Opcode.kI32Const);
                    }
                    section.emit_u32v(init.base);
                    section.emit_u8(Opcode.kEnd);
                    section.emit_u32v(init.array.length);
                    for (const index of init.array) {
                        section.emit_u32v(index);
                    }
                }
            });
        }

        // Add exceptions.
        if (wasm.exceptions.length > 0) {
            if (debug) {
                console.info("emitting exceptions @ " + binary.bytes.length);
            }
            binary.emit_section(SectionCode.kException, (section) => {
                section.emit_u32v(wasm.exceptions.length);
                for (const type of wasm.exceptions) {
                    section.emit_u32v(type.params.length);
                    for (const param of type.params) {
                        section.emit_u8(param);
                    }
                }
            });
        }

        // Add function bodies.
        if (wasm.functions.length > 0) {
            // emit function bodies
            if (debug) console.info("emitting code @ " + binary.bytes.length);
            binary.emit_section(SectionCode.kCode, (section) => {
                section.emit_u32v(wasm.functions.length);
                for (const func of wasm.functions) {
                    // Function body length will be patched later.
                    const local_decls = [];
                    for (const l of func.locals || []) {
                        if (l.i32_count > 0) {
                            local_decls.push(
                                { count: l.i32_count, type: Type.kI32 });
                        }
                        if (l.i64_count > 0) {
                            local_decls.push(
                                { count: l.i64_count, type: Type.kI64 });
                        }
                        if (l.f32_count > 0) {
                            local_decls.push(
                                { count: l.f32_count, type: Type.kF32 });
                        }
                        if (l.f64_count > 0) {
                            local_decls.push(
                                { count: l.f64_count, type: Type.kF64 });
                        }
                        if (l.s128_count > 0) {
                            local_decls.push(
                                { count: l.s128_count, type: Type.kS128 });
                        }
                    }

                    const header = new Binary();
                    header.emit_u32v(local_decls.length);
                    for (const decl of local_decls) {
                        header.emit_u32v(decl.count);
                        header.emit_u8(decl.type);
                    }

                    section.emit_u32v(header.bytes.length + func.body.length);
                    section.emit_bytes(header.bytes);
                    section.emit_bytes(func.body);
                }
            });
        }

        // Add data segments.
        if (wasm.segments.length > 0) {
            if (debug) {
                console.info(
                    "emitting data segments @ " + binary.bytes.length);
            }
            binary.emit_section(SectionCode.kData, (section) => {
                section.emit_u32v(wasm.segments.length);
                for (const seg of wasm.segments) {
                    section.emit_u8(0);  // linear memory index 0
                    if (seg.is_global) {
                        // initializer is a global variable
                        section.emit_u8(Opcode.kGetGlobal);
                        section.emit_u32v(seg.addr);
                    } else {
                        // initializer is a constant
                        section.emit_u8(Opcode.kI32Const);
                        section.emit_u32v(seg.addr);
                    }
                    section.emit_u8(Opcode.kEnd);
                    section.emit_u32v(seg.data.length);
                    section.emit_bytes(seg.data);
                }
            });
        }

        // Add any explicitly added sections
        for (const exp of wasm.explicit) {
            if (debug) {
                console.info("emitting explicit @ " + binary.bytes.length);
            }
            binary.emit_bytes(exp);
        }

        // Add names.
        let num_function_names = 0;
        let num_functions_with_local_names = 0;
        for (const func of wasm.functions) {
            if (func.name !== undefined)++num_function_names;
            if (func.numLocalNames() > 0)++num_functions_with_local_names;
        }
        if (num_function_names > 0 || num_functions_with_local_names > 0 ||
            wasm.name !== undefined) {
            if (debug) {
                console.info("emitting names @ " + binary.bytes.length);
            }
            binary.emit_section(SectionCode.kUnknown, (section) => {
                section.emit_string("name");
                // Emit module name.
                if (wasm.name !== undefined) {
                    section.emit_section(NameCode.kModule, (name_section) => {
                        name_section.emit_string(wasm.name);
                    });
                }
                // Emit function names.
                if (num_function_names > 0) {
                    section.emit_section(NameCode.kFunctions,
                        (name_section) => {
                            name_section.emit_u32v(num_function_names);
                            for (const func of wasm.functions) {
                                if (func.name === undefined) continue;
                                name_section.emit_u32v(func.index);
                                name_section.emit_string(func.name);
                            }
                    });
                }
                // Emit local names.
                if (num_functions_with_local_names > 0) {
                    section.emit_section(NameCode.kLocals, (name_section) => {
                        name_section.emit_u32v(num_functions_with_local_names);
                        for (const func of wasm.functions) {
                            if (func.numLocalNames() === 0) continue;
                            name_section.emit_u32v(func.index);
                            name_section.emit_u32v(func.numLocalNames());
                            for (let i = 0; i < func.local_names.length; ++i) {
                                if (func.local_names[i] === undefined) continue;
                                name_section.emit_u32v(i);
                                name_section.emit_string(func.local_names[i]);
                            }
                        }
                    });
                }
            });
        }

        return binary;
    }

    toBuffer(debug = false) {
        const bytes = this.toArray(debug).bytes;
        const buffer = new ArrayBuffer(bytes.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            const val = bytes[i];
            console.assert(typeof val === "number");
            // if ((typeof val) == "string") val = val.charCodeAt(0);
            view[i] = val | 0;
        }
        return buffer;
    }

    instantiate(ffi? : any) {
        const module = new WebAssembly.Module(this.toBuffer());
        const instance = new WebAssembly.Instance(module, ffi);
        return instance;
    }

    asyncInstantiate(ffi : any) {
        return WebAssembly.instantiate(this.toBuffer(), ffi)
            .then(({ module, instance }) => instance);
    }

    toModule(debug = false) {
        return new WebAssembly.Module(this.toBuffer(debug));
    }
}

