import * as Expressions from "../../2_statements/expressions";
import {StatementNode} from "../../nodes";
import {CurrentScope} from "../_current_scope";
import {InlineFS} from "../expressions/inline_fs";
import {Source} from "../expressions/source";

export class InsertInternal {
  public runSyntax(node: StatementNode, scope: CurrentScope, filename: string): void {

    const afterAssigning = node.findExpressionAfterToken("ASSIGNING");
    if (afterAssigning?.get() instanceof Expressions.FSTarget) {
      let source = node.findDirectExpression(Expressions.BasicSource);
      if (source === undefined) {
        source = node.findDirectExpression(Expressions.Source);
      }
      const sourceType = source ? new Source().runSyntax(source, scope, filename) : undefined;

      const inlinefs = afterAssigning?.findDirectExpression(Expressions.InlineFS);
      if (inlinefs) {
        new InlineFS().runSyntax(inlinefs, scope, filename, sourceType);
      }
    }

  }
}