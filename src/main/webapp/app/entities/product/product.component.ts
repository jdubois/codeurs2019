import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProduct } from 'app/shared/model/product.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ProductService } from './product.service';
import { ProductDeleteDialogComponent } from './product-delete-dialog.component';

@Component({
  selector: 'jhi-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit, OnDestroy {
  products: IProduct[];
  eventSubscriber: Subscription;
  itemsPerPage: number;
  links: any;
  page: any;
  predicate: any;
  reverse: any;
  totalItems: number;

  constructor(
    protected productService: ProductService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.products = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0
    };
    this.predicate = 'id';
    this.reverse = true;
  }

  loadAll() {
    this.productService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IProduct[]>) => this.paginateProducts(res.body, res.headers));
  }

  reset() {
    this.page = 0;
    this.products = [];
    this.loadAll();
  }

  loadPage(page) {
    this.page = page;
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInProducts();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IProduct) {
    return item.id;
  }

  registerChangeInProducts() {
    this.eventSubscriber = this.eventManager.subscribe('productListModification', () => this.reset());
  }

  delete(product: IProduct) {
    const modalRef = this.modalService.open(ProductDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.product = product;
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateProducts(data: IProduct[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    for (let i = 0; i < data.length; i++) {
      this.products.push(data[i]);
    }
  }
}
