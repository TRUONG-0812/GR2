import React from 'react'
import * as S from './profile.style'
import InputText from 'src/components/InputText/InputText'
import range from 'lodash/range'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { getDate, getMonth, getYear, isExists } from 'date-fns'
import { rules } from 'src/constants/rules'
import ErrorMessage from 'src/components/ErrorMessage/ErrorMessage'
import { updateMe } from 'src/pages/Auth/auth.slice'
import { unwrapResult } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'

export default function Profile() {
  const profile = useSelector(state => state.auth.profile)
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      name: profile.name || '',
      phone: profile.phone || '',
      address: profile.address || '',
      date: profile.date_of_birth
        ? getDate(new Date(profile.date_of_birth))
        : '',
      month: profile.date_of_birth
        ? getMonth(new Date(profile.date_of_birth))
        : '',
      year: profile.date_of_birth
        ? getYear(new Date(profile.date_of_birth))
        : ''
    }
  })
  const dispatch = useDispatch()

  const update = async data => {
    const body = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      date_of_birth: new Date(data.year, data.month, data.date).toISOString()
    }
    try {
      const res = await dispatch(updateMe(body)).then(unwrapResult)
      toast.success(res.message, {
        position: 'top-center',
        autoClose: 3000
      })
    } catch (error) {
      if (error.status === 422) {
        for (const key in error.data) {
          setError(key, {
            type: 'server',
            message: error.data[key]
          })
        }
      }
    }
  }

  const validateDate = () =>
    isExists(
      Number(getValues('year')),
      Number(getValues('month')),
      Number(getValues('date'))
    ) || 'Ng??y sinh kh??ng ????ng'

  return (
    <S.Profile>
      <Helmet>
        <title>H??? s?? c???a t??i</title>
      </Helmet>
      <S.ProfileHeader>
        <S.ProfileHeaderTitle>H??? s?? c???a t??i</S.ProfileHeaderTitle>
        <S.ProfileHeaderSubtitle>
          Qu???n l?? th??ng tin h??? s?? ????? b???o m???t t??i kho???n
        </S.ProfileHeaderSubtitle>
      </S.ProfileHeader>
      <S.ProfileInfo>
        <S.ProfileLeft onSubmit={handleSubmit(update)}>
          <S.InputLabel>
            <S.InputLabelLabel>Email</S.InputLabelLabel>
            <S.InputLabelContent>
              <S.InputLabelContentText>{profile.email}</S.InputLabelContentText>
            </S.InputLabelContent>
          </S.InputLabel>
          <S.InputLabel>
            <S.InputLabelLabel>T??n</S.InputLabelLabel>
            <S.InputLabelContent>
              <Controller
                name="name"
                control={control}
                rules={rules.name}
                render={({ field }) => (
                  <InputText
                    name="name"
                    type="text"
                    onChange={field.onChange}
                    value={getValues('name')}
                  />
                )}
              />
              <ErrorMessage name="name" errors={errors} />
            </S.InputLabelContent>
          </S.InputLabel>
          <S.InputLabel>
            <S.InputLabelLabel>S??? ??i???n tho???i</S.InputLabelLabel>
            <S.InputLabelContent>
              <Controller
                name="phone"
                control={control}
                rules={rules.phone}
                render={({ field }) => (
                  <InputText
                    name="phone"
                    type="text"
                    onChange={field.onChange}
                    value={getValues('phone')}
                  />
                )}
              />
              <ErrorMessage name="phone" errors={errors} />
            </S.InputLabelContent>
          </S.InputLabel>
          <S.InputLabel>
            <S.InputLabelLabel>?????a ch???</S.InputLabelLabel>
            <S.InputLabelContent>
              <Controller
                name="address"
                control={control}
                rules={rules.addresss}
                render={({ field }) => (
                  <InputText
                    name="address"
                    type="text"
                    onChange={field.onChange}
                    value={getValues('address')}
                  />
                )}
              />
              <ErrorMessage name="address" errors={errors} />
            </S.InputLabelContent>
          </S.InputLabel>
          <S.InputLabel>
            <S.InputLabelLabel>Ng??y sinh</S.InputLabelLabel>
            <S.InputLabelContent>
              <S.DateSelect>
                <Controller
                  name="date"
                  control={control}
                  rules={{
                    validate: {
                      date: validateDate
                    }
                  }}
                  render={({ field }) => (
                    <S.SelectDate
                      title="Ng??y"
                      options={range(1, 32).map(item => ({
                        name: item,
                        value: item
                      }))}
                      onChange={field.onChange}
                      value={getValues('date')}
                    />
                  )}
                />
                <Controller
                  name="month"
                  control={control}
                  rules={{
                    validate: {
                      date: validateDate
                    }
                  }}
                  render={({ field }) => (
                    <S.SelectDate
                      title="Th??ng"
                      options={range(0, 12).map(item => ({
                        name: item + 1,
                        value: item
                      }))}
                      onChange={field.onChange}
                      value={getValues('month')}
                    />
                  )}
                />
                <Controller
                  name="year"
                  control={control}
                  rules={{
                    validate: {
                      date: validateDate
                    }
                  }}
                  render={({ field }) => (
                    <S.SelectDate
                      title="N??m"
                      options={range(1900, 2021).map(item => ({
                        name: item,
                        value: item
                      }))}
                      onChange={field.onChange}
                      value={getValues('year')}
                    />
                  )}
                />
              </S.DateSelect>
            </S.InputLabelContent>
            <S.ErrorMessage>
              <ErrorMessage name="date" errors={errors} />
            </S.ErrorMessage>
          </S.InputLabel>
          <S.Submit>
            <S.ButtonSubmit type="submit">L??u</S.ButtonSubmit>
          </S.Submit>
        </S.ProfileLeft>
        <S.ProfileRight>
          <S.AvatarUploader>
            <S.Avatar>
              <img src="" alt="" />
            </S.Avatar>
            <S.InputFile type="file" accept=".jpg,.jpeg,.png" />
            <S.ButtonUpload light>Ch???n ???nh</S.ButtonUpload>
            <S.AvatarUploaderTextContainer>
              <div>D???ng l?????ng file t???i ??a 1 MB</div>
              <div>?????nh d???ng:.JPEG, .PNG</div>
            </S.AvatarUploaderTextContainer>
          </S.AvatarUploader>
        </S.ProfileRight>
      </S.ProfileInfo>
    </S.Profile>
  )
}
