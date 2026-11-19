import { Banknote, CreditCard, Clock3, Gift, Landmark, Truck } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { DeliverySteps } from './delivery-steps';

const deliveryMethods = ['Omniva', 'Smartpost', 'Unisend', 'DPD'];
const paymentMethods = [
  'Банковские ссылки (быстрый банковский перевод)',
  'Банковские карты (Visa, Mastercard, Maestro, Amex)',
  'Apple Pay',
  'Google Pay',
];
const returnReasons = [
  'Обнаружен производственный брак (изменённая консистенция, посторонний запах и т.д.)',
  'Товар пришёл с истёкшим сроком годности',
  'Вам был отправлен не тот товар или в неправильном количестве',
];

export default function DeliveryPage() {
  return <main className="delivery-page">
    <SiteHeader />
    <DeliverySteps>
      <article className="delivery-step">
        <div className="delivery-step-body">
          <div className="delivery-info-card">
            <h2 className="delivery-step-heading">Доставка</h2>
            <p>Заказы доставляются только по Эстонии</p>
            <h3>Способы доставки</h3>
            <ul className="delivery-methods">
              {deliveryMethods.map((method) => <li key={method}>{method}</li>)}
              <li>Самовывоз</li>
            </ul>
            <div className="delivery-details">
              <p className="delivery-cost-row"><Truck aria-hidden="true" /><span>Стоимость доставки <strong className="site-price">3 €</strong></span></p>
              <p className="delivery-icon-row"><Gift aria-hidden="true" /><span>Бесплатная доставка от <strong className="site-price">80 €</strong></span></p>
              <p className="delivery-icon-row"><Clock3 aria-hidden="true" /><span>Сроки доставки: заказ будет собран и отправлен в течение 1–3 рабочих дней. В выходные и праздничные дни отправка не осуществляется.</span></p>
            </div>
            <p className="delivery-shipping-note">
              После отправки заказа вы получите трек-номер для отслеживания посылки.
              <br />
              Также вы будете получать автоматические email-уведомления: «Заказ отправлен», «Посылка прибыла в автомат».
            </p>
          </div>
        </div>
      </article>

      <article className="delivery-step">
        <div className="delivery-step-body">
          <div className="delivery-info-card">
          <h2 className="delivery-step-heading">Оплата</h2>
          <p>Мы принимаем следующие способы оплаты через сервис Montonio:</p>
          <ul className="payment-methods">
            {paymentMethods.map((method, index) => {
              const Icon = [Landmark, CreditCard, null, null][index];
              return <li key={method}>
                {index === 2 ? <span className="payment-brand-icon payment-apple" aria-hidden="true">●</span> :
                  index === 3 ? <span className="payment-brand-icon payment-google" aria-hidden="true">G</span> : Icon ? <Icon aria-hidden="true" /> : null}
                <span>{method}</span>
              </li>;
            })}
          </ul>
          <p>Все платежи проходят через защищённый платёжный шлюз Montonio.<br />Данные вашей карты не хранятся на нашем сайте.</p>
          <p>После поступления оплаты заказ будет сразу передан в обработку.</p>
          </div>
        </div>
      </article>

      <article className="delivery-step">
        <div className="delivery-step-body">
          <div className="delivery-info-card return-info-card">
          <h2 className="delivery-step-heading">Возврат товара</h2>
          <p className="return-policy-note"><strong>Возврат товаров надлежащего качества невозможен</strong></p>
          <p>Мы готовы вернуть деньги или заменить товар, если:</p>
          <ul>
            {returnReasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
          </div>
        </div>
      </article>
    </DeliverySteps>
    <SiteFooter />
  </main>;
}
