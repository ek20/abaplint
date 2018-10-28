import {Statement} from "./statement";
import {verNot, str, seq, opt, IRunnable} from "../combi";
import {ReceiveParameters, FunctionName} from "../expressions";
import {Version} from "../../version";

export class Receive extends Statement {

  public getMatcher(): IRunnable {
    let ret = seq(str("RECEIVE RESULTS FROM FUNCTION"),
                  new FunctionName(),
                  opt(str("KEEPING TASK")),
                  new ReceiveParameters());

    return verNot(Version.Cloud, ret);
  }

}