// https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/network_interface_sg_attachment
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface NetworkInterfaceSgAttachmentConfig extends cdktf.TerraformMetaArguments {
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/network_interface_sg_attachment#id NetworkInterfaceSgAttachment#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/network_interface_sg_attachment#network_interface_id NetworkInterfaceSgAttachment#network_interface_id}
  */
  readonly networkInterfaceId: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/network_interface_sg_attachment#security_group_id NetworkInterfaceSgAttachment#security_group_id}
  */
  readonly securityGroupId: string;
}

/**
* Represents a {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/network_interface_sg_attachment aws_network_interface_sg_attachment}
*/
export class NetworkInterfaceSgAttachment extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "aws_network_interface_sg_attachment";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/network_interface_sg_attachment aws_network_interface_sg_attachment} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options NetworkInterfaceSgAttachmentConfig
  */
  public constructor(scope: Construct, id: string, config: NetworkInterfaceSgAttachmentConfig) {
    super(scope, id, {
      terraformResourceType: 'aws_network_interface_sg_attachment',
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
    this._networkInterfaceId = config.networkInterfaceId;
    this._securityGroupId = config.securityGroupId;
  }

  // ==========
  // ATTRIBUTES
  // ==========

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

  // network_interface_id - computed: false, optional: false, required: true
  private _networkInterfaceId?: string; 
  public get networkInterfaceId() {
    return this.getStringAttribute('network_interface_id');
  }
  public set networkInterfaceId(value: string) {
    this._networkInterfaceId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get networkInterfaceIdInput() {
    return this._networkInterfaceId;
  }

  // security_group_id - computed: false, optional: false, required: true
  private _securityGroupId?: string; 
  public get securityGroupId() {
    return this.getStringAttribute('security_group_id');
  }
  public set securityGroupId(value: string) {
    this._securityGroupId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get securityGroupIdInput() {
    return this._securityGroupId;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      id: cdktf.stringToTerraform(this._id),
      network_interface_id: cdktf.stringToTerraform(this._networkInterfaceId),
      security_group_id: cdktf.stringToTerraform(this._securityGroupId),
    };
  }
}