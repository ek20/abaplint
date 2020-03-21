import {IStatement} from "./_statement";
import {str, seq, opt, IStatementRunnable} from "../combi";
import {Target, Source} from "../expressions";

export class SetBit implements IStatement {

  public getMatcher(): IStatementRunnable {
    const ret = seq(str("SET BIT"),
                    new Source(),
                    str("OF"),
                    new Target(),
                    opt(seq(str("TO"), new Source())));

    return ret;
  }

}