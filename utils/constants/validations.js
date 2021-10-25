
import * as yup from 'yup'

const BALANCE_VALID = yup.string()
  .required('Please input field.');

const ADDRESS_VALID = yup.string()
  .length(42, 'Address length should be 42')
  .required('Please input field.');

export {
  BALANCE_VALID,
  ADDRESS_VALID
};