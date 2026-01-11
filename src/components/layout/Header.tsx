"use client";

import Link from "next/link";
import { Languages } from "lucide-react";
import {
  HeaderContainer,
  HeaderContent,
  LeftSection,
  Logo,
  RightSection,
  NavLink,
  IconButton,
} from "./Header.style";

export default function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <Logo>
            <Link href="/">MAGO</Link>
          </Logo>
          <NavLink>
            <Link href="/">타로 시작하기</Link>
          </NavLink>
        </LeftSection>

        <RightSection>
          <IconButton>
            <Languages size={20} />
          </IconButton>
          <NavLink>
            <Link href="/login">로그인</Link>
          </NavLink>
          <NavLink>
            <Link href="/signup">회원가입</Link>
          </NavLink>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
}
