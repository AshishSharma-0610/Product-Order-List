import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Order {
  name: string;
  quantity: number | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Product Order List';
  products = ['Pencil', 'Eraser', 'Pens'];
  quantities = [0, 1, 2, 3, 4, 5];
  orders: Order[] = [{ name: '', quantity: null }];
  finalOrders: Order[] = [];
  showFinalOrder = false;
  errorMessage = '';

  constructor(private http: HttpClient) { }

  addOrder() {
    if (this.orders.length < 8) {
      this.orders.push({ name: '', quantity: 0 });
    }
  }

  showOrder() {
    this.errorMessage = '';



    const invalidRows = this.orders.filter(order =>
      (order.name && order.quantity === null) || (!order.name && order.quantity !== null)
    );

    if (invalidRows.length > 0) {
      this.errorMessage = 'Please select both product and quantity for all rows.';
      return;
    }


    this.finalOrders = this.orders.filter(order => order.name !== '' || order.quantity !== 0);

    if (this.finalOrders.length === 0) {
      this.errorMessage = 'Please add at least one product to the order.';
      return;
    }

    this.showFinalOrder = true;
  }

  getVoiceOrder() {
    if (this.finalOrders.length === 0) {
      this.errorMessage = 'Please show the order first.';
      return;
    }

    const orderList = this.finalOrders.map(order => `${order.quantity} ${order.name}`).join(', ');
    const apiKey = '5da54438161e40c8a9067c6b30c2c912';
    const url = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&v=Amy&src=${orderList}`;

    this.http.get(url, { responseType: 'blob' }).subscribe((response: Blob) => {
      const audioUrl = URL.createObjectURL(response);
      const audio = new Audio(audioUrl);
      audio.play();
    });
  }

  updateName(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    this.orders[index].name = selectElement.value;
    if (index === this.orders.length - 1 && this.orders.length < 8) {
      this.addOrder();
    }
    this.showFinalOrder = false;
  }

  updateQuantity(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    this.orders[index].quantity = selectElement.value === '' ? null : +selectElement.value;
    this.showFinalOrder = false;
  }
}
