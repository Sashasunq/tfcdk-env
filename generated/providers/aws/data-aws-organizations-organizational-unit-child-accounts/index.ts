// https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/organizations_organizational_unit_child_accounts
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface DataAwsOrganizationsOrganizationalUnitChildAccountsConfig extends cdktf.TerraformMetaArguments {
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/organizations_organizational_unit_child_accounts#id DataAwsOrganizationsOrganizationalUnitChildAccounts#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/organizations_organizational_unit_child_accounts#parent_id DataAwsOrganizationsOrganizationalUnitChildAccounts#parent_id}
  */
  readonly parentId: string;
}
export interface DataAwsOrganizationsOrganizationalUnitChildAccountsAccounts {
}

export function dataAwsOrganizationsOrganizationalUnitChildAccountsAccountsToTerraform(struct?: DataAwsOrganizationsOrganizationalUnitChildAccountsAccounts): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
  }
}

export class DataAwsOrganizationsOrganizationalUnitChildAccountsAccountsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param complexObjectIndex the index of this item in the list
  * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean) {
    super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
  }

  public get internalValue(): DataAwsOrganizationsOrganizationalUnitChildAccountsAccounts | undefined {
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: DataAwsOrganizationsOrganizationalUnitChildAccountsAccounts | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
    }
  }

  // arn - computed: true, optional: false, required: false
  public get arn() {
    return this.getStringAttribute('arn');
  }

  // email - computed: true, optional: false, required: false
  public get email() {
    return this.getStringAttribute('email');
  }

  // id - computed: true, optional: false, required: false
  public get id() {
    return this.getStringAttribute('id');
  }

  // name - computed: true, optional: false, required: false
  public get name() {
    return this.getStringAttribute('name');
  }

  // status - computed: true, optional: false, required: false
  public get status() {
    return this.getStringAttribute('status');
  }
}

export class DataAwsOrganizationsOrganizationalUnitChildAccountsAccountsList extends cdktf.ComplexList {

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param wrapsSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  constructor(protected terraformResource: cdktf.IInterpolatingParent, protected terraformAttribute: string, protected wrapsSet: boolean) {
    super(terraformResource, terraformAttribute, wrapsSet)
  }

  /**
  * @param index the index of the item to return
  */
  public get(index: number): DataAwsOrganizationsOrganizationalUnitChildAccountsAccountsOutputReference {
    return new DataAwsOrganizationsOrganizationalUnitChildAccountsAccountsOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}

/**
* Represents a {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/organizations_organizational_unit_child_accounts aws_organizations_organizational_unit_child_accounts}
*/
export class DataAwsOrganizationsOrganizationalUnitChildAccounts extends cdktf.TerraformDataSource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "aws_organizations_organizational_unit_child_accounts";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/organizations_organizational_unit_child_accounts aws_organizations_organizational_unit_child_accounts} Data Source
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options DataAwsOrganizationsOrganizationalUnitChildAccountsConfig
  */
  public constructor(scope: Construct, id: string, config: DataAwsOrganizationsOrganizationalUnitChildAccountsConfig) {
    super(scope, id, {
      terraformResourceType: 'aws_organizations_organizational_unit_child_accounts',
      terraformGeneratorMetadata: {
        providerName: 'aws',
        providerVersion: '5.20.1',
        providerVersionConstraint: '~> 5.0'
      },
      provider: config.provider,
      dependsOn: config.dependsOn,
      count: config.count,
      lifecycle: config.lifecycle,
      provisioners: config.provisioners,
      connection: config.connection,
      forEach: config.forEach
    });
    this._id = config.id;
    this._parentId = config.parentId;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // accounts - computed: true, optional: false, required: false
  private _accounts = new DataAwsOrganizationsOrganizationalUnitChildAccountsAccountsList(this, "accounts", false);
  public get accounts() {
    return this._accounts;
  }

  // id - computed: true, optional: true, required: false
  private _id?: string; 
  public get id() {
    return this.getStringAttribute('id');
  }
  public set id(value: string) {
    this._id = value;
  }
  public resetId() {
    this._id = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get idInput() {
    return this._id;
  }

  // parent_id - computed: false, optional: false, required: true
  private _parentId?: string; 
  public get parentId() {
    return this.getStringAttribute('parent_id');
  }
  public set parentId(value: string) {
    this._parentId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get parentIdInput() {
    return this._parentId;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      id: cdktf.stringToTerraform(this._id),
      parent_id: cdktf.stringToTerraform(this._parentId),
    };
  }
}
