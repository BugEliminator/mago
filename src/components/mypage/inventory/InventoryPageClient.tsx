"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Package,
  RectangleVertical,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  ShoppingBag,
  Info,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import { TarotCardToastIcon } from "@/components/common/toast/ToastIcons";
import { MypageMobileFixedTopBarSpacer } from "@/components/mypage/common/mypageMobileFixedTopBar.style";
import { TAROT_CLASSIC_BACK_IMAGE_PATH } from "@/types/tarot";
import {
  type InventoryTab,
  OWNED_SKINS,
  OWNED_PERSONAS,
  DEFAULT_EQUIPPED_SKIN_ID,
  DEFAULT_EQUIPPED_PERSONA_ID,
} from "./inventoryMockData";
import {
  InventoryRoot,
  InventoryHeader,
  TitleGroup,
  InventoryTitle,
  InventorySubtitle,
  MobileTopBar,
  BackButton,
  MobileHeaderBlock,
  MobileTitleText,
  MobileInventorySubtitle,
  MobileInventorySection,
  MobileGuaranteeBox,
  MobileTabBar,
  MobileTabChip,
  MobileTabPanel,
  MobileTabPanelMain,
  InventoryBody,
  InventoryGrid,
  InventorySidebar,
  SidebarLabel,
  TabButton,
  TabButtonLabel,
  TabChevron,
  GuaranteeBox,
  GuaranteeTitle,
  GuaranteeDesc,
  InventoryContent,
  TabPanel,
  TabPanelMain,
  SkinGrid,
  SkinCard,
  SkinPreview,
  SkinMiniCard,
  SkinMiniCardInner,
  SkinEquippedBadge,
  SkinCardBody,
  SkinCardTitleRow,
  SkinCardTitle,
  SkinBadge,
  SkinCardDesc,
  SkinEquipBtn,
  PersonaInfoBox,
  PersonaInfoText,
  PersonaList,
  PersonaCard,
  PersonaLeft,
  PersonaIconBox,
  PersonaText,
  PersonaTitleRow,
  PersonaTitle,
  PersonaBadge,
  PersonaDesc,
  SoundwaveRow,
  SoundwaveLabel,
  SoundwaveBar,
  PersonaEquipBtn,
  StoreBanner,
  StoreBannerLeft,
  StoreIconBox,
  StoreBannerTitle,
  StoreBannerDesc,
  StoreBannerBtn,
} from "./InventoryPageClient.style";

const SOUNDWAVE_BAR_COUNT = 7;

const INVENTORY_MOBILE_TABS: { id: InventoryTab; label: string }[] = [
  { id: "skins", label: "보유 카드 스킨" },
  { id: "personas", label: "리딩 페르소나 설정" },
];

/** 상점 페이지 — 준비 중 토스트 */
function handleStoreBrowse() {
  toast("준비중입니다!", { icon: <TarotCardToastIcon /> });
}

/** MAGO GUARANTEE 블록 */
function GuaranteeBlock() {
  return (
    <>
      <GuaranteeTitle>
        <span>✦</span> MAGO GUARANTEE
      </GuaranteeTitle>
      <GuaranteeDesc>
        구매하신 스킨 및 테마는 운세 생성 시 프롬프트와 카드 UI에 영구 장착되어
        연동됩니다.
      </GuaranteeDesc>
    </>
  );
}

export default function InventoryPageClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InventoryTab>("skins");
  const [equippedSkin, setEquippedSkin] = useState(DEFAULT_EQUIPPED_SKIN_ID);
  const [equippedPersona, setEquippedPersona] = useState(
    DEFAULT_EQUIPPED_PERSONA_ID,
  );

  const handleEquipSkin = (id: string, title: string) => {
    setEquippedSkin(id);
    toast.success(`[${title}] 스킨이 타로 리딩에 장착되었습니다.`);
  };

  const handleEquipPersona = (id: string, title: string) => {
    setEquippedPersona(id);
    toast.success(`리딩 페르소나가 [${title}] 테마로 전환되었습니다.`);
  };

  /** 카드 스킨 그리드 */
  const renderSkinGrid = () => (
    <SkinGrid>
      {OWNED_SKINS.map((skin) => {
        const isEquipped = equippedSkin === skin.id;
        return (
          <SkinCard key={skin.id} $equipped={isEquipped}>
            <SkinPreview $equipped={isEquipped}>
              <SkinMiniCard>
                <SkinMiniCardInner>
                  <Image
                    src={TAROT_CLASSIC_BACK_IMAGE_PATH}
                    alt="마고 클래식 덱 카드 뒷면"
                    fill
                    sizes="80px"
                    draggable={false}
                  />
                </SkinMiniCardInner>
              </SkinMiniCard>
              {isEquipped && (
                <SkinEquippedBadge>
                  <Check size={12} strokeWidth={3.5} />
                  사용중
                </SkinEquippedBadge>
              )}
            </SkinPreview>
            <SkinCardBody>
              <div>
                <SkinCardTitleRow>
                  <SkinCardTitle>{skin.title}</SkinCardTitle>
                  <SkinBadge>{skin.badge}</SkinBadge>
                </SkinCardTitleRow>
                <SkinCardDesc>{skin.description}</SkinCardDesc>
              </div>
              <SkinEquipBtn
                type="button"
                $equipped={isEquipped}
                onClick={() =>
                  !isEquipped && handleEquipSkin(skin.id, skin.title)
                }
              >
                {isEquipped ? "선택된 카드 스킨" : "스킨 교체하기"}
              </SkinEquipBtn>
            </SkinCardBody>
          </SkinCard>
        );
      })}
    </SkinGrid>
  );

  /** 페르소나 목록 */
  const renderPersonaList = () => (
    <>
      <PersonaInfoBox>
        <Info size={16} color="#3949ab" />
        <PersonaInfoText>
          페르소나를 장착하면 타로 해설 문장의 말투와 상세 조언 프롬프트가 해당
          캐릭터의 성격에 맞춰 재구성됩니다.
        </PersonaInfoText>
      </PersonaInfoBox>

      <PersonaList>
        {OWNED_PERSONAS.map((persona) => {
          const isEquipped = equippedPersona === persona.id;
          return (
            <PersonaCard key={persona.id} $equipped={isEquipped}>
              <PersonaLeft>
                <PersonaIconBox>
                  <Volume2 size={20} color="#3949ab" />
                </PersonaIconBox>
                <PersonaText>
                  <PersonaTitleRow>
                    <PersonaTitle>{persona.title}</PersonaTitle>
                    <PersonaBadge>{persona.badge}</PersonaBadge>
                  </PersonaTitleRow>
                  <PersonaDesc>{persona.description}</PersonaDesc>
                  <SoundwaveRow>
                    <SoundwaveLabel>{persona.voiceDesc}</SoundwaveLabel>
                    {Array.from({ length: SOUNDWAVE_BAR_COUNT }, (_, idx) => (
                      <SoundwaveBar
                        key={idx}
                        $active={isEquipped}
                        $height={Math.sin(idx) * 8 + 12}
                      />
                    ))}
                  </SoundwaveRow>
                </PersonaText>
              </PersonaLeft>
              <PersonaEquipBtn
                type="button"
                $equipped={isEquipped}
                onClick={() =>
                  !isEquipped && handleEquipPersona(persona.id, persona.title)
                }
              >
                {isEquipped ? (
                  <>
                    <Check size={14} />
                    선택된 테마
                  </>
                ) : (
                  "테마 적용하기"
                )}
              </PersonaEquipBtn>
            </PersonaCard>
          );
        })}
      </PersonaList>
    </>
  );

  /** 상점 유도 배너 — 탭별 문구 */
  const renderStoreBanner = (tab: InventoryTab) => (
    <StoreBanner>
      <StoreBannerLeft>
        <StoreIconBox>
          <ShoppingBag size={20} color="#3949ab" />
        </StoreIconBox>
        <div>
          <StoreBannerTitle>
            {tab === "skins"
              ? "새로운 카드 스킨 찾기"
              : "나에게 맞는 찰떡 페르소나 찾기"}
          </StoreBannerTitle>
          <StoreBannerDesc>
            {tab === "skins"
              ? "상점에서 다양한 전통/전설 타로 스킨을 엽전으로 교환해 보세요."
              : "상점에서 다양한 성향과 깊은 연륜을 가진 페르소나 말투 테마를 만나보세요."}
          </StoreBannerDesc>
        </div>
      </StoreBannerLeft>
      <StoreBannerBtn type="button" onClick={handleStoreBrowse}>
        상점 구경하기
        <ChevronRight size={14} />
      </StoreBannerBtn>
    </StoreBanner>
  );

  /** 모바일 탭 패널 — 콘텐츠 + 하단 배너 */
  const renderMobileTabPanel = () => (
    <MobileTabPanel role="tabpanel">
      <MobileTabPanelMain>
        {activeTab === "skins" ? renderSkinGrid() : renderPersonaList()}
      </MobileTabPanelMain>
      {renderStoreBanner(activeTab)}
    </MobileTabPanel>
  );

  return (
    <InventoryRoot>
      {/* 모바일 전용: 뒤로가기 */}
      <MobileTopBar>
        <BackButton
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.push("/mypage")}
        >
          <ChevronLeft size={18} />
        </BackButton>
      </MobileTopBar>
      <MypageMobileFixedTopBarSpacer aria-hidden />

      {/* 모바일 전용: 제목 + 부제 */}
      <MobileHeaderBlock>
        <MobileTitleText>
          <Package size={18} />
          상점 보관함
        </MobileTitleText>
        <MobileInventorySubtitle>
          내가 보유 중인 타로 스킨과 리딩 페르소나 테마를 관리하고 장착합니다.
        </MobileInventorySubtitle>
      </MobileHeaderBlock>

      {/* 모바일 전용: GUARANTEE + 탭 + 패널 */}
      <MobileInventorySection>
        <MobileGuaranteeBox>
          <GuaranteeBlock />
        </MobileGuaranteeBox>

        <MobileTabBar role="tablist" aria-label="보관함 탭">
          {INVENTORY_MOBILE_TABS.map((tab) => (
            <MobileTabChip
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </MobileTabChip>
          ))}
        </MobileTabBar>

        {renderMobileTabPanel()}
      </MobileInventorySection>

      {/* 데스크톱 헤더 */}
      <InventoryHeader>
        <TitleGroup>
          <InventoryTitle>
            <Package size={20} />
            상점 보관함
          </InventoryTitle>
          <InventorySubtitle>
            내가 보유 중인 타로 스킨과 리딩 페르소나 테마를 관리하고 장착합니다.
          </InventorySubtitle>
        </TitleGroup>
      </InventoryHeader>

      {/* 데스크톱 본문 */}
      <InventoryBody>
        <InventoryGrid>
          <InventorySidebar>
            <SidebarLabel>보관함 분류</SidebarLabel>

            <TabButton
              type="button"
              $active={activeTab === "skins"}
              onClick={() => setActiveTab("skins")}
            >
              <TabButtonLabel>
                <RectangleVertical size={16} />
                보유 카드 스킨
              </TabButtonLabel>
              <TabChevron $active={activeTab === "skins"}>
                <ChevronRight size={14} />
              </TabChevron>
            </TabButton>

            <TabButton
              type="button"
              $active={activeTab === "personas"}
              onClick={() => setActiveTab("personas")}
            >
              <TabButtonLabel>
                <UserCheck size={16} />
                리딩 페르소나 설정
              </TabButtonLabel>
              <TabChevron $active={activeTab === "personas"}>
                <ChevronRight size={14} />
              </TabChevron>
            </TabButton>

            <GuaranteeBox>
              <GuaranteeBlock />
            </GuaranteeBox>
          </InventorySidebar>

          <InventoryContent>
            {activeTab === "skins" && (
              <TabPanel>
                <TabPanelMain>{renderSkinGrid()}</TabPanelMain>
                {renderStoreBanner("skins")}
              </TabPanel>
            )}

            {activeTab === "personas" && (
              <TabPanel>
                <TabPanelMain>{renderPersonaList()}</TabPanelMain>
                {renderStoreBanner("personas")}
              </TabPanel>
            )}
          </InventoryContent>
        </InventoryGrid>
      </InventoryBody>
    </InventoryRoot>
  );
}
