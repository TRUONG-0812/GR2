import { createNextState, unwrapResult } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Checkbox from 'src/components/Checkbox/Checkbox'
import ProductQuantityController from 'src/components/ProductQuantityController/ProductQuantityController'
import { formatMoney } from 'src/utils/helper'
import {
  buyPurchases,
  deletePurchases,
  getCartPurchases,
  updatePurchase
} from './cart.slice'
import * as S from './cart.style'
import keyBy from 'lodash/keyBy'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'

export default function Cart() {
  const purchases = useSelector(state => state.cart.purchases)
  console.log(purchases)
  const [localPurchases, setLocalPurchases] = useState(() =>
    createNextState(purchases, draft => {
      draft.forEach(purchase => {
        purchase.disabled = false
        purchase.checked = false
      })
    })
  )
  const dispatch = useDispatch()
  const isCheckedAll = localPurchases.every(purchase => purchase.checked)
  const checkedPurchases = localPurchases.filter(purchase => purchase.checked)
  const totalCheckedPurchases = checkedPurchases.length
  const totalCheckedPurchasesPrice = checkedPurchases.reduce(
    (result, current) => {
      return result + current.product.price * current.buy_count
    },
    0
  )
  const totalCheckedPurchasesSavingPrice = checkedPurchases.reduce(
    (result, current) => {
      return (
        result +
        (current.product.price_before_discount - current.product.price) *
          current.buy_count
      )
    },
    0
  )
  useEffect(() => {
    setLocalPurchases(localPurchases => {
      const localPurchasesObject = keyBy(localPurchases, '_id')
      return createNextState(purchases, draft => {
        draft.forEach(purchase => {
          purchase.disabled = false
          purchase.checked = Boolean(
            localPurchasesObject[purchase._id]?.checked
          )
        })
      })
    })
  }, [purchases])

  const handleInputQuantity = indexPurchase => value => {
    const newLocalPurchases = createNextState(localPurchases, draft => {
      draft[indexPurchase].buy_count = value
    })
    setLocalPurchases(newLocalPurchases)
  }

  const handleBlurQuantity = indexPurchase => async value => {
    const purchase = localPurchases[indexPurchase]
    setLocalPurchases(localPurchases =>
      createNextState(localPurchases, draft => {
        draft[indexPurchase].disabled = true
      })
    )
    await dispatch(
      updatePurchase({
        product_id: purchase.product._id,
        buy_count: value
      })
    ).then(unwrapResult)
    await dispatch(getCartPurchases()).then(unwrapResult)
    setLocalPurchases(localPurchases =>
      createNextState(localPurchases, draft => {
        draft[indexPurchase].disabled = false
      })
    )
  }

  const handleIncreaseAndDecrease = indexPurchase => async value => {
    const purchase = localPurchases[indexPurchase]
    setLocalPurchases(localPurchases =>
      createNextState(localPurchases, draft => {
        draft[indexPurchase].disabled = true
        draft[indexPurchase].buy_count = value
      })
    )
    await dispatch(
      updatePurchase({
        product_id: purchase.product._id,
        buy_count: value
      })
    ).then(unwrapResult)
    await dispatch(getCartPurchases()).then(unwrapResult)
    setLocalPurchases(localPurchases =>
      createNextState(localPurchases, draft => {
        draft[indexPurchase].disabled = false
      })
    )
  }

  const handleCheck = indexPurchase => value => {
    setLocalPurchases(localPurchases =>
      createNextState(localPurchases, draft => {
        draft[indexPurchase].checked = value
      })
    )
  }

  const handleCheckAll = () => {
    setLocalPurchases(localPurchases =>
      createNextState(localPurchases, draft => {
        draft.forEach(purchase => {
          purchase.checked = !isCheckedAll
        })
      })
    )
  }

  const handleRemove = indexPurchase => async () => {
    const purchase_id = localPurchases[indexPurchase]._id
    await dispatch(deletePurchases([purchase_id])).then(unwrapResult)
    await dispatch(getCartPurchases()).then(unwrapResult)
    toast.success('X??a ????n th??nh c??ng', {
      position: 'top-center',
      autoClose: 3000
    })
  }

  const handleRemoveManyPurchases = async () => {
    const purchase_ids = checkedPurchases.map(purchase => purchase._id)
    await dispatch(deletePurchases(purchase_ids)).then(unwrapResult)
    await dispatch(getCartPurchases()).then(unwrapResult)
    toast.success('X??a ????n th??nh c??ng', {
      position: 'top-center',
      autoClose: 3000
    })
  }

  const handleBuyPurchases = async () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map(purchase => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      await dispatch(buyPurchases(body)).then(unwrapResult)
      await dispatch(getCartPurchases()).then(unwrapResult)
      toast.success('?????t ????n h??ng th??nh c??ng', {
        position: 'top-center',
        autoClose: 3000
      })
    }
  }

  return (
    <div className="container">
      <Helmet>
        <title>Gi??? h??ng</title>
      </Helmet>
      <div>
        <S.ProductHeader>
          <S.ProductHeaderCheckbox>
            <Checkbox onChange={handleCheckAll} checked={isCheckedAll} />
          </S.ProductHeaderCheckbox>
          <S.ProductHeaderName>S???n ph???m</S.ProductHeaderName>
          <S.ProductHeaderUnitPrice>????n gi??</S.ProductHeaderUnitPrice>
          <S.ProductHeaderQuantity>S??? l?????ng</S.ProductHeaderQuantity>
          <S.ProductHeaderTotalPrice>S??? ti???n</S.ProductHeaderTotalPrice>
          <S.ProductHeaderAction>Thao t??c</S.ProductHeaderAction>
        </S.ProductHeader>
        <S.ProductSection>
          {localPurchases.map((purchase, index) => (
            <S.CartItem key={purchase._id}>
              <S.CartItemCheckbox>
                <Checkbox
                  checked={purchase.checked}
                  onChange={handleCheck(index)}
                />
              </S.CartItemCheckbox>
              <S.CartItemOverview>
                <S.CartItemOverviewImage to="">
                  <img src={purchase.product.images[0]} alt="" />
                </S.CartItemOverviewImage>
                <S.CartItemOverviewNameWrapper>
                  <S.CartItemOverviewName to="">
                    {purchase.product.name}
                  </S.CartItemOverviewName>
                </S.CartItemOverviewNameWrapper>
              </S.CartItemOverview>
              <S.CartItemUnitPrice>
                <span>
                  ??{formatMoney(purchase.product.price_before_discount)}
                </span>
                <span>??{formatMoney(purchase.product.price)}</span>
              </S.CartItemUnitPrice>
              <S.CartItemQuantity>
                <ProductQuantityController
                  max={purchase.product.quantity}
                  value={purchase.buy_count}
                  disabled={purchase.disabled}
                  onInput={handleInputQuantity(index)}
                  onBlur={handleBlurQuantity(index)}
                  onIncrease={handleIncreaseAndDecrease(index)}
                  onDecrease={handleIncreaseAndDecrease(index)}
                />
              </S.CartItemQuantity>
              <S.CartItemTotalPrice>
                <span>
                  ??{formatMoney(purchase.product.price * purchase.buy_count)}
                </span>
              </S.CartItemTotalPrice>
              <S.CartItemAction>
                <S.CartItemActionButton onClick={handleRemove(index)}>
                  X??a
                </S.CartItemActionButton>
              </S.CartItemAction>
            </S.CartItem>
          ))}
        </S.ProductSection>
      </div>
      <S.CartFooter>
        <S.CartFooterCheckbox>
          <Checkbox onChange={handleCheckAll} checked={isCheckedAll} />
        </S.CartFooterCheckbox>
        <S.CartFooterButton onClick={handleCheckAll}>
          Ch???n t???t c??? ({purchases.length})
        </S.CartFooterButton>
        <S.CartFooterButton onClick={handleRemoveManyPurchases}>
          X??a
        </S.CartFooterButton>
        <S.CartFooterSpaceBetween />
        <S.CartFooterPrice>
          <S.CartFooterPriceTop>
            <div>T???ng thanh to??n ({totalCheckedPurchases} s???n ph???m): </div>
            <div>??{formatMoney(totalCheckedPurchasesPrice)}</div>
          </S.CartFooterPriceTop>
          <S.CartFooterPriceBot>
            <div>Ti???t ki???m</div>
            <div>??{formatMoney(totalCheckedPurchasesSavingPrice)}</div>
          </S.CartFooterPriceBot>
        </S.CartFooterPrice>
        <S.CartFooterCheckout onClick={handleBuyPurchases}>
          Mua h??ng
        </S.CartFooterCheckout>
      </S.CartFooter>
    </div>
  )
}
