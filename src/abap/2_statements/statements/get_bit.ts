import {IStatement} from "./_statement";
import {str, seq, IStatementRunnable} from "../combi";
import {Target, Source} from "../expressions";

export class GetBit implements IStatement {

  public getMatcher(): IStatementRunnable {
    const ret = seq(str("GET BIT"),
                    new Source(),
                    str("OF"),
                    new Source(),
                    str("INTO"),
                    new Target());

    return ret;
  }

}