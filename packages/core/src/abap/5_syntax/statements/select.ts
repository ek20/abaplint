import * as Expressions from "../../2_statements/expressions";
import {StatementNode} from "../../nodes";
import {CurrentScope} from "../_current_scope";
import {VoidType} from "../../types/basic";
import {InlineData} from "../expressions/inline_data";

export class Select {
  public runSyntax(node: StatementNode, scope: CurrentScope, filename: string): void {
/*
    const tab = node.findFirstExpression(Expressions.SQLTargetTable);
    if (tab) {
*/
    const inline = node.findFirstExpression(Expressions.InlineData);
    if (inline) {
      // todo, for now these are voided
      new InlineData().runSyntax(inline, scope, filename, new VoidType("SELECT_todo"));
    }

  }
}