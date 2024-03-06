import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef: BsModalRef | undefined;

  constructor(private modalService: BsModalService) {}

  openClimbModal() {
    this.modalRef = this.modalService.show(LogClimbModalComponent);
  }
}