import {expect} from "chai";
import {UnusedVariables} from "../../src/rules";
import {Registry} from "../../src/registry";
import {MemoryFile} from "../../src/files/memory_file";
import {Issue} from "../../src/issue";
import {testRuleFixSingle} from "./_utils";

function testFix(input: string, expected: string) {
  testRuleFixSingle(input, expected, new UnusedVariables());
}

function runSingle(abap: string): Issue[] {
  const reg = new Registry().addFile(new MemoryFile("zfoo.prog.abap", abap)).parse();
  return new UnusedVariables().initialize(reg).run(reg.getObjects()[0]);
}

describe("Rule: unused_variables, single file", () => {

  it("test", async () => {
    const abap = "parser error";
    expect(runSingle(abap).length).to.equal(0);
  });

  it("test", async () => {
    const abap = "parser error.";
    expect(runSingle(abap).length).to.equal(0);
  });

  it("test", async () => {
    const abap = "WRITE bar.";
    expect(runSingle(abap).length).to.equal(0);
  });

  it("test", async () => {
    const abap = "DATA foo.";
    expect(runSingle(abap).length).to.equal(1);
  });

  it("test", async () => {
    const abap = "DATA foo.\nWRITE foo.";
    expect(runSingle(abap).length).to.equal(0);
  });

  it("class with attribute", async () => {
    const abap =
`CLASS lcl_foo DEFINITION.
  PRIVATE SECTION.
    METHODS bar.
    DATA: mv_bits TYPE string.
ENDCLASS.

CLASS lcl_foo IMPLEMENTATION.
  METHOD bar.
    mv_bits = '123'.
  ENDMETHOD.
ENDCLASS.`;
    expect(runSingle(abap).length).to.equal(0);
  });

  it("class with method", async () => {
    const abap = `
CLASS lcl_abapgit_zlib_stream DEFINITION.
  PUBLIC SECTION.
    METHODS take_int
      IMPORTING
        !iv_length    TYPE i
      RETURNING
        VALUE(rv_int) TYPE i.
ENDCLASS.

CLASS lcl_abapgit_zlib_stream IMPLEMENTATION.
  METHOD take_int.
    WRITE iv_length TO rv_int.
  ENDMETHOD.
ENDCLASS.`;
    expect(runSingle(abap).length).to.equal(0);
  });

  it("test, quickfix simple", async () => {
    testFix("DATA foo.", "");
  });

  it("test, quickfix with TYPE", async () => {
    testFix("DATA foo TYPE i.", "");
  });

  it.skip("test, quickfix, chained first", async () => {
    testFix(`DATA: foo, bar.
WRITE bar.`, `DATA: bar.
WRITE bar.`);
  });

  it.skip("test, quickfix, chained last", async () => {
    testFix(`DATA: bar, foo.
WRITE bar.`, `DATA: bar.
WRITE bar.`);
  });

  it.skip("test, quickfix, only one fix per scope per time", async () => {
    testFix(`DATA: foo, bar.`, `DATA: bar.`);
  });

});
