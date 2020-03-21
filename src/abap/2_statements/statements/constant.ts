import {IStatement} from "./_statement";
import * as Expressions from "../expressions";
import {str, seq, alt, opt, IStatementRunnable, per} from "../combi";
import {NamespaceSimpleName, Type, Value, Length, Decimals, ConstantFieldLength} from "../expressions";
import {StatementNode} from "../../nodes";
import {CurrentScope} from "../../syntax/_current_scope";
import {BasicTypes} from "../../syntax/basic_types";
import {TypedIdentifier, IdentifierMeta} from "../../types/_typed_identifier";
import {UnknownType} from "../../types/basic";

export class Constant implements IStatement {

  public getMatcher(): IStatementRunnable {
    const def = seq(new NamespaceSimpleName(),
                    opt(new ConstantFieldLength()),
                    per(new Type(), new Value(), new Decimals(), new Length()));

    const ret = seq(alt(str("CONSTANT"), str("CONSTANTS")), def);

    return ret;
  }

  public runSyntax(node: StatementNode, scope: CurrentScope, filename: string): TypedIdentifier {
    const basic = new BasicTypes(filename, scope);
    const found = basic.simpleType(node);
    if (found) {
      const val = basic.findValue(node);
      if (val !== undefined) {
        return new TypedIdentifier(found.getToken(), filename, found.getType(), [IdentifierMeta.ReadOnly], val);
      } else {
        return new TypedIdentifier(found.getToken(), filename, new UnknownType("todo, TypedConstantIdentifier"), [IdentifierMeta.ReadOnly], "unknown");
      }
    }

    const fallback = node.findFirstExpression(Expressions.NamespaceSimpleName);
    if (fallback) {
      return new TypedIdentifier(fallback.getFirstToken(), filename, new UnknownType("constant, fallback"));
    }

    throw new Error("Statement Constant: unexpected structure");
  }

}