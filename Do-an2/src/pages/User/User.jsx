import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { path } from 'src/constants/path'
import * as S from './user.style'
import Profile from './Profile/Profile'
import Password from './Password/Password'
import Purchase from './Purchase/Purchase'

export default function User() {
  return (
    <div>
      <S.Container className="container">
        <S.Sidebar>
          <S.Brief>
            <S.BriefAvatar to={path.user + path.profile}>
              <img
                src="data:image/jpeg;base64,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"
                alt=""
              />
            </S.BriefAvatar>
            <S.BriefRight>
              <S.BriefUsername></S.BriefUsername>
              <S.BriefEdit to={path.user + path.profile}>
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: 4 }}
                >
                  <path
                    d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48"
                    fill="#9B9B9B"
                    fillRule="evenodd"
                  />
                </svg>
                Sửa hồ sơ
              </S.BriefEdit>
            </S.BriefRight>
          </S.Brief>
          <S.SidebarMenu>
            <S.SidebarMenuEntry to={path.user + path.profile}>
              <S.SidebarMenuEntryIcon>
                <img
                  src="https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4"
                  alt=""
                />
              </S.SidebarMenuEntryIcon>
              Tài khoản của tôi
            </S.SidebarMenuEntry>
            <S.SidebarMenuEntry to={path.user + path.password}>
              <S.SidebarMenuEntryIcon>
                <img
                  src="https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4"
                  alt=""
                />
              </S.SidebarMenuEntryIcon>
              Đổi mật khẩu
            </S.SidebarMenuEntry>
            <S.SidebarMenuEntry to={path.user + path.purchase}>
              <S.SidebarMenuEntryIcon>
                <img
                  src="https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078"
                  alt=""
                />
              </S.SidebarMenuEntryIcon>
              Đơn mua
            </S.SidebarMenuEntry>
          </S.SidebarMenu>
        </S.Sidebar>
        <S.Main>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={path.user + path.profile} />}
            ></Route>
            <Route path={path.profile.slice(1)} element={<Profile />}></Route>
            <Route path={path.password.slice(1)} element={<Password />}></Route>
            <Route path={path.purchase.slice(1)} element={<Purchase />}></Route>
          </Routes>
        </S.Main>
      </S.Container>
    </div>
  )
}
