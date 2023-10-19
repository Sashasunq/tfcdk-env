// https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface ServicecatalogProductPortfolioAssociationConfig extends cdktf.TerraformMetaArguments {
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association#accept_language ServicecatalogProductPortfolioAssociation#accept_language}
  */
  readonly acceptLanguage?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association#id ServicecatalogProductPortfolioAssociation#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association#portfolio_id ServicecatalogProductPortfolioAssociation#portfolio_id}
  */
  readonly portfolioId: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association#product_id ServicecatalogProductPortfolioAssociation#product_id}
  */
  readonly productId: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association#source_portfolio_id ServicecatalogProductPortfolioAssociation#source_portfolio_id}
  */
  readonly sourcePortfolioId?: string;
  /**
  * timeouts block
  *
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association#timeouts ServicecatalogProductPortfolioAssociation#timeouts}
  */
  readonly timeouts?: ServicecatalogProductPortfolioAssociationTimeouts;
}
export interface ServicecatalogProductPortfolioAssociationTimeouts {
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association#create ServicecatalogProductPortfolioAssociation#create}
  */
  readonly create?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association#delete ServicecatalogProductPortfolioAssociation#delete}
  */
  readonly delete?: string;
  /**
  * Docs at Terraform Registry: {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association#read ServicecatalogProductPortfolioAssociation#read}
  */
  readonly read?: string;
}

export function servicecatalogProductPortfolioAssociationTimeoutsToTerraform(struct?: ServicecatalogProductPortfolioAssociationTimeouts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    create: cdktf.stringToTerraform(struct!.create),
    delete: cdktf.stringToTerraform(struct!.delete),
    read: cdktf.stringToTerraform(struct!.read),
  }
}

export class ServicecatalogProductPortfolioAssociationTimeoutsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false);
  }

  public get internalValue(): ServicecatalogProductPortfolioAssociationTimeouts | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._create !== undefined) {
      hasAnyValues = true;
      internalValueResult.create = this._create;
    }
    if (this._delete !== undefined) {
      hasAnyValues = true;
      internalValueResult.delete = this._delete;
    }
    if (this._read !== undefined) {
      hasAnyValues = true;
      internalValueResult.read = this._read;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: ServicecatalogProductPortfolioAssociationTimeouts | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._create = undefined;
      this._delete = undefined;
      this._read = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._create = value.create;
      this._delete = value.delete;
      this._read = value.read;
    }
  }

  // create - computed: false, optional: true, required: false
  private _create?: string; 
  public get create() {
    return this.getStringAttribute('create');
  }
  public set create(value: string) {
    this._create = value;
  }
  public resetCreate() {
    this._create = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get createInput() {
    return this._create;
  }

  // delete - computed: false, optional: true, required: false
  private _delete?: string; 
  public get delete() {
    return this.getStringAttribute('delete');
  }
  public set delete(value: string) {
    this._delete = value;
  }
  public resetDelete() {
    this._delete = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get deleteInput() {
    return this._delete;
  }

  // read - computed: false, optional: true, required: false
  private _read?: string; 
  public get read() {
    return this.getStringAttribute('read');
  }
  public set read(value: string) {
    this._read = value;
  }
  public resetRead() {
    this._read = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get readInput() {
    return this._read;
  }
}

/**
* Represents a {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association aws_servicecatalog_product_portfolio_association}
*/
export class ServicecatalogProductPortfolioAssociation extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "aws_servicecatalog_product_portfolio_association";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://registry.terraform.io/providers/hashicorp/aws/5.20.1/docs/resources/servicecatalog_product_portfolio_association aws_servicecatalog_product_portfolio_association} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options ServicecatalogProductPortfolioAssociationConfig
  */
  public constructor(scope: Construct, id: string, config: ServicecatalogProductPortfolioAssociationConfig) {
    super(scope, id, {
      terraformResourceType: 'aws_servicecatalog_product_portfolio_association',
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
    this._acceptLanguage = config.acceptLanguage;
    this._id = config.id;
    this._portfolioId = config.portfolioId;
    this._productId = config.productId;
    this._sourcePortfolioId = config.sourcePortfolioId;
    this._timeouts.internalValue = config.timeouts;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // accept_language - computed: false, optional: true, required: false
  private _acceptLanguage?: string; 
  public get acceptLanguage() {
    return this.getStringAttribute('accept_language');
  }
  public set acceptLanguage(value: string) {
    this._acceptLanguage = value;
  }
  public resetAcceptLanguage() {
    this._acceptLanguage = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get acceptLanguageInput() {
    return this._acceptLanguage;
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

  // portfolio_id - computed: false, optional: false, required: true
  private _portfolioId?: string; 
  public get portfolioId() {
    return this.getStringAttribute('portfolio_id');
  }
  public set portfolioId(value: string) {
    this._portfolioId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get portfolioIdInput() {
    return this._portfolioId;
  }

  // product_id - computed: false, optional: false, required: true
  private _productId?: string; 
  public get productId() {
    return this.getStringAttribute('product_id');
  }
  public set productId(value: string) {
    this._productId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get productIdInput() {
    return this._productId;
  }

  // source_portfolio_id - computed: false, optional: true, required: false
  private _sourcePortfolioId?: string; 
  public get sourcePortfolioId() {
    return this.getStringAttribute('source_portfolio_id');
  }
  public set sourcePortfolioId(value: string) {
    this._sourcePortfolioId = value;
  }
  public resetSourcePortfolioId() {
    this._sourcePortfolioId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sourcePortfolioIdInput() {
    return this._sourcePortfolioId;
  }

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new ServicecatalogProductPortfolioAssociationTimeoutsOutputReference(this, "timeouts");
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: ServicecatalogProductPortfolioAssociationTimeouts) {
    this._timeouts.internalValue = value;
  }
  public resetTimeouts() {
    this._timeouts.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get timeoutsInput() {
    return this._timeouts.internalValue;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      accept_language: cdktf.stringToTerraform(this._acceptLanguage),
      id: cdktf.stringToTerraform(this._id),
      portfolio_id: cdktf.stringToTerraform(this._portfolioId),
      product_id: cdktf.stringToTerraform(this._productId),
      source_portfolio_id: cdktf.stringToTerraform(this._sourcePortfolioId),
      timeouts: servicecatalogProductPortfolioAssociationTimeoutsToTerraform(this._timeouts.internalValue),
    };
  }
}
