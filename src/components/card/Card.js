import React from "react";
import {
    Accent,
    AccentSecondary,
    BackHint,
    BackTop,
    BankName,
    BottomRow,
    BrandFallback,
    BrandFallbackText,
    BrandLogo,
    Cardholder,
    CardType,
    Chip,
    ChipLine,
    ChipLineHorizontal,
    Container,
    Content,
    CvvBox,
    CvvText,
    Expiry,
    Label,
    NumberText,
    Signature,
    SignatureRow,
    TopRow,
    Value,
    BrandSlot,
} from "./Styles";

const getBrandLogo = (icon) => {
    if (icon === "63" || icon === "65") {
        return {
            source: require("../../../assets/elo.png"),
            variant: "elo",
        };
    }

    if (icon === "55") {
        return {
            source: require("../../../assets/masterCard.png"),
            variant: "master",
        };
    }

    if (icon === "41" || icon === "42" || icon === "49") {
        return {
            source: require("../../../assets/visa.png"),
            variant: "visa",
        };
    }

    return null;
};

const formatCardNumber = (number) => {
    return number || "0000 0000 0000 0000";
};

const CardBrand = ({ icon }) => {
    const logo = getBrandLogo(icon);

    if (logo) {
        return (
            <BrandSlot>
                <BrandLogo source={logo.source} variant={logo.variant} />
            </BrandSlot>
        );
    }

    return (
        <BrandSlot>
            <BrandFallback>
                <BrandFallbackText>BB</BrandFallbackText>
            </BrandFallback>
        </BrandSlot>
    );
};

const Card = ({ data, back, icon }) => {
    const name = data.name?.trim() || "NOME DO TITULAR";
    const validate = data.validate || "MM/AA";
    const cvv = data.cvv || "000";

    return (
        <Container>
            <Content>
                <Accent />
                <AccentSecondary />

                {back ? (
                    <>
                        <BackTop />
                        <SignatureRow>
                            <Signature />
                            <CvvBox>
                                <CvvText>{cvv}</CvvText>
                            </CvvBox>
                        </SignatureRow>
                        <BackHint>Use o CVV apenas em compras seguras.</BackHint>
                    </>
                ) : (
                    <>
                        <TopRow>
                            <Chip>
                                <ChipLine />
                                <ChipLineHorizontal />
                            </Chip>
                            <CardBrand icon={icon} />
                        </TopRow>

                        <NumberText>{formatCardNumber(data.number)}</NumberText>

                        <BottomRow>
                            <Cardholder>
                                <Label>Titular</Label>
                                <Value numberOfLines={1}>{name.toUpperCase()}</Value>
                            </Cardholder>
                            <Expiry>
                                <Label>Validade</Label>
                                <Value>{validate}</Value>
                            </Expiry>
                        </BottomRow>

                        <TopRow>
                            <BankName>BlockBank</BankName>
                            <CardType>Debit</CardType>
                        </TopRow>
                    </>
                )}
            </Content>
        </Container>
    );
};

export default Card;
