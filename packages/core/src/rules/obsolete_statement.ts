import {Issue} from "../issue";
import * as Statements from "../abap/2_statements/statements";
import {ABAPRule} from "./_abap_rule";
import {ABAPFile} from "../files";
import {Compare, DataDefinition} from "../abap/2_statements/expressions";
import {BasicRuleConfig} from "./_basic_rule_config";
import {Position} from "../position";

export class ObsoleteStatementConf extends BasicRuleConfig {
  /** Check for REFRESH statement */
  public refresh: boolean = true;
  /** Check for COMPUTE statement */
  public compute: boolean = true;
  /** Check for ADD statement */
  public add: boolean = true;
  /** Check for SUBTRACT statement */
  public subtract: boolean = true;
  /** Check for MULTIPLY statement */
  public multiply: boolean = true;
  /** Check for MOVE statement */
  public move: boolean = true;
  /** Check for DIVIDE statement */
  public divide: boolean = true;
  /** Checks for usages of IS REQUESTED */
  public requested: boolean = true;
  /** Checks for usages of OCCURS */
  public occurs: boolean = true;
  /** Checks for SET EXTENDED CHECK, https://help.sap.com/doc/abapdocu_751_index_htm/7.51/en-us/abapset_extended_check.htm */
  public setExtended: boolean = true;
}

export class ObsoleteStatement extends ABAPRule {

  private conf = new ObsoleteStatementConf();

  public getMetadata() {
    return {
      key: "obsolete_statement",
      title: "Obsolete statements",
      shortDescription: `Checks for usages of certain obsolete statements`,
    };
  }

  private getMessage(): string {
    return "Statement is obsolete";
  }

  public getConfig() {
    return this.conf;
  }

  public setConfig(conf: ObsoleteStatementConf) {
    this.conf = conf;
  }

  public runParsed(file: ABAPFile) {
    const issues: Issue[] = [];

    const statements = file.getStatements();
    let prev: Position | undefined = undefined;

    for (const sta of statements) {
      if ((sta.get() instanceof Statements.Refresh && this.conf.refresh)
          || (sta.get() instanceof Statements.Compute && this.conf.compute)
          || (sta.get() instanceof Statements.Add && this.conf.add)
          || (sta.get() instanceof Statements.Subtract && this.conf.subtract)
          || (sta.get() instanceof Statements.Multiply && this.conf.multiply)
          || (sta.get() instanceof Statements.Move && this.conf.move
          && sta.getTokens()[0].getStr() === "MOVE"
          && sta.getTokens()[1].getStr() !== "-"
          && sta.getTokens()[1].getStr() !== "EXACT")
          || (sta.get() instanceof Statements.Divide && this.conf.divide)) {
        if (prev === undefined || sta.getStart().getCol() !== prev.getCol() || sta.getStart().getRow() !== prev.getRow()) {
          const issue = Issue.atStatement(file, sta, this.getMessage(), this.getMetadata().key);
          issues.push(issue);
        }
        prev = sta.getStart();
      }

      if (this.conf.setExtended && sta.get() instanceof Statements.SetExtendedCheck) {
        const issue = Issue.atStatement(file, sta, "SET EXTENDED CHECK is obsolete", this.getMetadata().key);
        issues.push(issue);
      }

      if (this.conf.requested) {
        for (const compare of sta.findAllExpressions(Compare)) {
          const token = compare.findDirectTokenByText("REQUESTED");
          if (token) {
            const issue = Issue.atToken(file, token, "IS REQUESTED is obsolete", this.getMetadata().key);
            issues.push(issue);
          }
        }
      }
      if (this.conf.occurs) {
        if ((sta.get() instanceof Statements.Describe)
          || (sta.get() instanceof Statements.Ranges)) {
          const token = sta.findDirectTokenByText("OCCURS");
          if (token) {
            const issue = Issue.atToken(file, token, "OCCURS is obsolete", this.getMetadata().key);
            issues.push(issue);
          }
        }

        for (const dataDef of sta.findAllExpressions(DataDefinition)) {
          const token = dataDef.findDirectTokenByText("OCCURS");
          if (token) {
            const issue = Issue.atToken(file, token, "OCCURS is obsolete", this.getMetadata().key);
            issues.push(issue);
          }
        }
      }
    }
    return issues;
  }
}