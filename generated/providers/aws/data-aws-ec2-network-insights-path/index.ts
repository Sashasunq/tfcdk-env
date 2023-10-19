// https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/ec2_network_insights_path
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface DataAwsEc2NetworkInsightsPathConfig extends cdktf.TerraformMetaArguments {
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/ec2_network_insights_path#id DataAwsEc2NetworkInsightsPath#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/ec2_network_insights_path#network_insights_path_id DataAwsEc2NetworkInsightsPath#network_insights_path_id}
  */
  readonly networkInsightsPathId?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/ec2_network_insights_path#tags DataAwsEc2NetworkInsightsPath#tags}
  */
  readonly tags?: { [key: string]: string };
  /**
  * filter block
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/ec2_network_insights_path#filter DataAwsEc2NetworkInsightsPath#filter}
  */
  readonly filter?: DataAwsEc2NetworkInsightsPathFilter[] | cdktf.IResolvable;
}
export interface DataAwsEc2NetworkInsightsPathFilter {
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/ec2_network_insights_path#name DataAwsEc2NetworkInsightsPath#name}
  */
  readonly name: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/ec2_network_insights_path#values DataAwsEc2NetworkInsightsPath#values}
  */
  readonly values: string[];
}

export function dataAwsEc2NetworkInsightsPathFilterToTerraform(struct?: DataAwsEc2NetworkInsightsPathFilter | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    name: cdktf.stringToTerraform(struct!.name),
    values: cdktf.listMapper(cdktf.stringToTerraform, false)(struct!.values),
  }
}

export class DataAwsEc2NetworkInsightsPathFilterOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param complexObjectIndex the index of this item in the list
  * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean) {
    super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
  }

  public get internalValue(): DataAwsEc2NetworkInsightsPathFilter | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._name !== undefined) {
      hasAnyValues = true;
      internalValueResult.name = this._name;
    }
    if (this._values !== undefined) {
      hasAnyValues = true;
      internalValueResult.values = this._values;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: DataAwsEc2NetworkInsightsPathFilter | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._name = undefined;
      this._values = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._name = value.name;
      this._values = value.values;
    }
  }

  // name - computed: false, optional: false, required: true
  private _name?: string; 
  public get name() {
    return this.getStringAttribute('name');
  }
  public set name(value: string) {
    this._name = value;
  }
  // Temporarily expose input value. Use with caution.
  public get nameInput() {
    return this._name;
  }

  // values - computed: false, optional: false, required: true
  private _values?: string[]; 
  public get values() {
    return cdktf.Fn.tolist(this.getListAttribute('values'));
  }
  public set values(value: string[]) {
    this._values = value;
  }
  // Temporarily expose input value. Use with caution.
  public get valuesInput() {
    return this._values;
  }
}

export class DataAwsEc2NetworkInsightsPathFilterList extends cdktf.ComplexList {
  public internalValue? : DataAwsEc2NetworkInsightsPathFilter[] | cdktf.IResolvable

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
  public get(index: number): DataAwsEc2NetworkInsightsPathFilterOutputReference {
    return new DataAwsEc2NetworkInsightsPathFilterOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}

/**
* Represents a {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/ec2_network_insights_path aws_ec2_network_insights_path}
*/
export class DataAwsEc2NetworkInsightsPath extends cdktf.TerraformDataSource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "aws_ec2_network_insights_path";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/data-sources/ec2_network_insights_path aws_ec2_network_insights_path} Data Source
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options DataAwsEc2NetworkInsightsPathConfig = {}
  */
  public constructor(scope: Construct, id: string, config: DataAwsEc2NetworkInsightsPathConfig = {}) {
    super(scope, id, {
      terraformResourceType: 'aws_ec2_network_insights_path',
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
    this._networkInsightsPathId = config.networkInsightsPathId;
    this._tags = config.tags;
    this._filter.internalValue = config.filter;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // arn - computed: true, optional: false, required: false
  public get arn() {
    return this.getStringAttribute('arn');
  }

  // destination - computed: true, optional: false, required: false
  public get destination() {
    return this.getStringAttribute('destination');
  }

  // destination_arn - computed: true, optional: false, required: false
  public get destinationArn() {
    return this.getStringAttribute('destination_arn');
  }

  // destination_ip - computed: true, optional: false, required: false
  public get destinationIp() {
    return this.getStringAttribute('destination_ip');
  }

  // destination_port - computed: true, optional: false, required: false
  public get destinationPort() {
    return this.getNumberAttribute('destination_port');
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

  // network_insights_path_id - computed: true, optional: true, required: false
  private _networkInsightsPathId?: string; 
  public get networkInsightsPathId() {
    return this.getStringAttribute('network_insights_path_id');
  }
  public set networkInsightsPathId(value: string) {
    this._networkInsightsPathId = value;
  }
  public resetNetworkInsightsPathId() {
    this._networkInsightsPathId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get networkInsightsPathIdInput() {
    return this._networkInsightsPathId;
  }

  // protocol - computed: true, optional: false, required: false
  public get protocol() {
    return this.getStringAttribute('protocol');
  }

  // source - computed: true, optional: false, required: false
  public get source() {
    return this.getStringAttribute('source');
  }

  // source_arn - computed: true, optional: false, required: false
  public get sourceArn() {
    return this.getStringAttribute('source_arn');
  }

  // source_ip - computed: true, optional: false, required: false
  public get sourceIp() {
    return this.getStringAttribute('source_ip');
  }

  // tags - computed: true, optional: true, required: false
  private _tags?: { [key: string]: string }; 
  public get tags() {
    return this.getStringMapAttribute('tags');
  }
  public set tags(value: { [key: string]: string }) {
    this._tags = value;
  }
  public resetTags() {
    this._tags = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get tagsInput() {
    return this._tags;
  }

  // filter - computed: false, optional: true, required: false
  private _filter = new DataAwsEc2NetworkInsightsPathFilterList(this, "filter", true);
  public get filter() {
    return this._filter;
  }
  public putFilter(value: DataAwsEc2NetworkInsightsPathFilter[] | cdktf.IResolvable) {
    this._filter.internalValue = value;
  }
  public resetFilter() {
    this._filter.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get filterInput() {
    return this._filter.internalValue;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      id: cdktf.stringToTerraform(this._id),
      network_insights_path_id: cdktf.stringToTerraform(this._networkInsightsPathId),
      tags: cdktf.hashMapper(cdktf.stringToTerraform)(this._tags),
      filter: cdktf.listMapper(dataAwsEc2NetworkInsightsPathFilterToTerraform, true)(this._filter.internalValue),
    };
  }
}
