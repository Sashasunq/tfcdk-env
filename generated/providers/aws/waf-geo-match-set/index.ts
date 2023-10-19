// https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/waf_geo_match_set
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface WafGeoMatchSetConfig extends cdktf.TerraformMetaArguments {
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/waf_geo_match_set#id WafGeoMatchSet#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/waf_geo_match_set#name WafGeoMatchSet#name}
  */
  readonly name: string;
  /**
  * geo_match_constraint block
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/waf_geo_match_set#geo_match_constraint WafGeoMatchSet#geo_match_constraint}
  */
  readonly geoMatchConstraint?: WafGeoMatchSetGeoMatchConstraint[] | cdktf.IResolvable;
}
export interface WafGeoMatchSetGeoMatchConstraint {
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/waf_geo_match_set#type WafGeoMatchSet#type}
  */
  readonly type: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/waf_geo_match_set#value WafGeoMatchSet#value}
  */
  readonly value: string;
}

export function wafGeoMatchSetGeoMatchConstraintToTerraform(struct?: WafGeoMatchSetGeoMatchConstraint | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    type: cdktf.stringToTerraform(struct!.type),
    value: cdktf.stringToTerraform(struct!.value),
  }
}

export class WafGeoMatchSetGeoMatchConstraintOutputReference extends cdktf.ComplexObject {
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

  public get internalValue(): WafGeoMatchSetGeoMatchConstraint | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._type !== undefined) {
      hasAnyValues = true;
      internalValueResult.type = this._type;
    }
    if (this._value !== undefined) {
      hasAnyValues = true;
      internalValueResult.value = this._value;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: WafGeoMatchSetGeoMatchConstraint | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._type = undefined;
      this._value = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._type = value.type;
      this._value = value.value;
    }
  }

  // type - computed: false, optional: false, required: true
  private _type?: string; 
  public get type() {
    return this.getStringAttribute('type');
  }
  public set type(value: string) {
    this._type = value;
  }
  // Temporarily expose input value. Use with caution.
  public get typeInput() {
    return this._type;
  }

  // value - computed: false, optional: false, required: true
  private _value?: string; 
  public get value() {
    return this.getStringAttribute('value');
  }
  public set value(value: string) {
    this._value = value;
  }
  // Temporarily expose input value. Use with caution.
  public get valueInput() {
    return this._value;
  }
}

export class WafGeoMatchSetGeoMatchConstraintList extends cdktf.ComplexList {
  public internalValue? : WafGeoMatchSetGeoMatchConstraint[] | cdktf.IResolvable

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
  public get(index: number): WafGeoMatchSetGeoMatchConstraintOutputReference {
    return new WafGeoMatchSetGeoMatchConstraintOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}

/**
* Represents a {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/waf_geo_match_set aws_waf_geo_match_set}
*/
export class WafGeoMatchSet extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "aws_waf_geo_match_set";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/waf_geo_match_set aws_waf_geo_match_set} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options WafGeoMatchSetConfig
  */
  public constructor(scope: Construct, id: string, config: WafGeoMatchSetConfig) {
    super(scope, id, {
      terraformResourceType: 'aws_waf_geo_match_set',
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
    this._name = config.name;
    this._geoMatchConstraint.internalValue = config.geoMatchConstraint;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // arn - computed: true, optional: false, required: false
  public get arn() {
    return this.getStringAttribute('arn');
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

  // geo_match_constraint - computed: false, optional: true, required: false
  private _geoMatchConstraint = new WafGeoMatchSetGeoMatchConstraintList(this, "geo_match_constraint", true);
  public get geoMatchConstraint() {
    return this._geoMatchConstraint;
  }
  public putGeoMatchConstraint(value: WafGeoMatchSetGeoMatchConstraint[] | cdktf.IResolvable) {
    this._geoMatchConstraint.internalValue = value;
  }
  public resetGeoMatchConstraint() {
    this._geoMatchConstraint.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get geoMatchConstraintInput() {
    return this._geoMatchConstraint.internalValue;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      id: cdktf.stringToTerraform(this._id),
      name: cdktf.stringToTerraform(this._name),
      geo_match_constraint: cdktf.listMapper(wafGeoMatchSetGeoMatchConstraintToTerraform, true)(this._geoMatchConstraint.internalValue),
    };
  }
}