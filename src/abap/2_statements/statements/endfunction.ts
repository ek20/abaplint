import {IStatement} from "./_statement";
import {str, IStatementRunnable} from "../combi";

export class EndFunction implements IStatement {

  public getMatcher(): IStatementRunnable {
    return str("ENDFUNCTION");
  }

}