import { CHECKOUT_STEP_1 } from '@/constants/routes';
import { Form, Formik } from 'formik';
import { displayActionMessage } from '@/helpers/utils';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import CreditPayment from './CreditPayment';
import PayPalPayment from './PayPalPayment';
import CashOnDeliveryPayment from './CashOnDeliveryPayment';
import Total from './Total';
import { useDispatch } from 'react-redux';
import { addOrder } from '@/redux/actions/checkoutActions';
import { displayMoney } from '@/helpers/utils';
import { clearBasket } from '@/redux/actions/basketActions';

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Name should be at least 4 characters.')
    .required('Name is required'),
  cardnumber: Yup.string()
    .min(13, 'Card number should be 13-19 digits long')
    .max(19, 'Card number should only be 13-19 digits long')
    .required('Card number is required.'),
  expiry: Yup.date()
    .required('Credit card expiry is required.'),
  ccv: Yup.string()
    .min(3, 'CCV length should be 3-4 digit')
    .max(4, 'CCV length should only be 3-4 digit')
    .required('CCV is required.'),
  type: Yup.string().required('Please select payment mode')
});

const Payment = ({ shipping, payment, subtotal }) => {
  const dispatch = useDispatch();
  const { basket } = useSelector((state) => ({
    basket: state.basket
  }));
  useDocumentTitle('Check Out Final Step | PesticidesShop');
  useScrollTop();

  const initFormikValues = {
    name: payment.name || '',
    cardnumber: payment.cardnumber || '',
    expiry: payment.expiry || '',
    ccv: payment.ccv || '',
    type: payment.type || 'cod'
  };

  const onConfirm = (value) => {
    const totalMoney = displayMoney(subtotal + (shipping.isInternational ? 50 : 0));
    const order = {
      Shipping: {
        address: shipping.address,
        email: shipping.email,
        fullname: shipping.fullname,
        mobile: shipping.mobile
      },
      Payment: payment.type,
      Products: basket,
      Total: totalMoney,
      OrderAt: new Date(),
      Status: 0
    }
    dispatch(addOrder(order));
    setTimeout(() => {
      dispatch(clearBasket());
    }, 500)
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={ payment.type === 'credit' ? FormSchema : null}
        validate={(form) => {
          if (form.type === 'paypal' || form.type === 'credit') {
            displayActionMessage('Feature not ready yet :)', 'info');
          }
        }}
        onSubmit={(value) => onConfirm(value)}
      >
        {() => (
          <Form className="checkout-step-3">
            <CreditPayment />
            <PayPalPayment />
            <CashOnDeliveryPayment />
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string
  }).isRequired,
  subtotal: PropType.number.isRequired
};

export default withCheckout(Payment);
