// https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/iam_security_token_service_preferences
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface IamSecurityTokenServicePreferencesConfig extends cdktf.TerraformMetaArguments {
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/iam_security_token_service_preferences#global_endpoint_token_version IamSecurityTokenServicePreferences#global_endpoint_token_version}
  */
  readonly globalEndpointTokenVersion: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/iam_security_token_service_preferences#id IamSecurityTokenServicePreferences#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
}

/**
* Represents a {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/iam_security_token_service_preferences aws_iam_security_token_service_preferences}
*/
export class IamSecurityTokenServicePreferences extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "aws_iam_security_token_service_preferences";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/iam_security_token_service_preferences aws_iam_security_token_service_preferences} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options IamSecurityTokenServicePreferencesConfig
  */
  public constructor(scope: Construct, id: string, config: IamSecurityTokenServicePreferencesConfig) {
    super(scope, id, {
      terraformResourceType: 'aws_iam_security_token_service_preferences',
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
    this._globalEndpointTokenVersion = config.globalEndpointTokenVersion;
    this._id = config.id;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // global_endpoint_token_version - computed: false, optional: false, required: true
  private _globalEndpointTokenVersion?: string; 
  public get globalEndpointTokenVersion() {
    return this.getStringAttribute('global_endpoint_token_version');
  }
  public set globalEndpointTokenVersion(value: string) {
    this._globalEndpointTokenVersion = value;
  }
  // Temporarily expose input value. Use with caution.
  public get globalEndpointTokenVersionInput() {
    return this._globalEndpointTokenVersion;
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

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      global_endpoint_token_version: cdktf.stringToTerraform(this._globalEndpointTokenVersion),
      id: cdktf.stringToTerraform(this._id),
    };
  }
}
