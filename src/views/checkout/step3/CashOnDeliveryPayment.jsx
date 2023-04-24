/* eslint-disable jsx-a11y/label-has-associated-control */
import { useFormikContext } from 'formik';
import React from 'react';
import CodPayment from '@/images/CodPayment.png'

const CashOnDeliveryPayment = () => {
  const { values, setValues } = useFormikContext();

  return (
    <div className={`checkout-fieldset-collapse ${values.type === 'cod' ? 'is-selected-payment' : ''}`}>
      <div className="checkout-field margin-0">
        <div className="checkout-checkbox-field">
          <input
            checked={values.type === 'cod'}
            id="modeCOD"
            name="type"
            onChange={(e) => {
              if (e.target.checked) {
                setValues({ ...values, type: 'cod' });
              }
            }}
            type="radio"
          />
          <label
            className="d-flex w-100"
            htmlFor="modeCOD"
          >
            <div className="d-flex-grow-1 margin-left-s">
              <h4 className="margin-0">Cash On Delivery</h4>
              <span className="text-subtle d-block margin-top-s">
                Build customers trust, Safe payment method.
              </span>
            </div>
            <div className="payment-cod">
            <img alt="cod" src={CodPayment}/>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CashOnDeliveryPayment;
