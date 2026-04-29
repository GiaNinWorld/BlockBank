import styled from "styled-components/native";

export const Container = styled.View`
    width: 100%;
    align-items: center;
    margin-bottom: 28px;
`;

export const Content = styled.View`
    width: 100%;
    height: 196px;
    border-radius: 18px;
    padding: 20px;
    background-color: #1f2430;
    overflow: hidden;
    justify-content: space-between;
`;

export const Accent = styled.View`
    position: absolute;
    right: -70px;
    top: -95px;
    width: 220px;
    height: 220px;
    border-radius: 110px;
    background-color: #ff6962;
    opacity: 0.92;
`;

export const AccentSecondary = styled.View`
    position: absolute;
    left: -42px;
    bottom: -70px;
    width: 150px;
    height: 150px;
    border-radius: 75px;
    background-color: #3099d9;
    opacity: 0.26;
`;

export const TopRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const BankName = styled.Text`
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
`;

export const CardType = styled.Text`
    color: rgba(255, 255, 255, 0.72);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
`;

export const Chip = styled.View`
    width: 42px;
    height: 30px;
    border-radius: 7px;
    background-color: #d5b76f;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.35);
`;

export const ChipLine = styled.View`
    position: absolute;
    left: 13px;
    width: 1px;
    height: 30px;
    background-color: rgba(72, 57, 20, 0.45);
`;

export const ChipLineHorizontal = styled.View`
    position: absolute;
    top: 14px;
    width: 42px;
    height: 1px;
    background-color: rgba(72, 57, 20, 0.45);
`;

export const NumberText = styled.Text`
    color: #ffffff;
    font-size: 21px;
    font-weight: 700;
    letter-spacing: 0px;
`;

export const BottomRow = styled.View`
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
`;

export const Cardholder = styled.View`
    flex: 1;
    padding-right: 12px;
`;

export const Label = styled.Text`
    color: rgba(255, 255, 255, 0.5);
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 3px;
`;

export const Value = styled.Text`
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
`;

export const Expiry = styled.View`
    min-width: 54px;
    margin-right: 12px;
`;

export const BrandSlot = styled.View`
    width: 76px;
    height: 50px;
    align-items: center;
    justify-content: center;
`;

export const BrandLogo = styled.Image`
    width: ${({ variant }) => variant === "master" ? "58px" : "70px"};
    height: ${({ variant }) => variant === "master" ? "42px" : "48px"};
    resize-mode: contain;
`;

export const BrandFallback = styled.View`
    width: 52px;
    height: 34px;
    border-radius: 8px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.4);
    align-items: center;
    justify-content: center;
`;

export const BrandFallbackText = styled.Text`
    color: rgba(255, 255, 255, 0.75);
    font-size: 10px;
    font-weight: 800;
`;

export const BackTop = styled.View`
    margin: -20px -20px 0;
    height: 48px;
    background-color: #111318;
`;

export const SignatureRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 28px;
`;

export const Signature = styled.View`
    flex: 1;
    height: 38px;
    border-radius: 4px;
    background-color: #f4f1e8;
`;

export const CvvBox = styled.View`
    width: 58px;
    height: 38px;
    border-radius: 4px;
    background-color: #ffffff;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
`;

export const CvvText = styled.Text`
    color: #1e1e1e;
    font-size: 14px;
    font-weight: 800;
`;

export const BackHint = styled.Text`
    color: rgba(255, 255, 255, 0.62);
    font-size: 11px;
    margin-top: 16px;
`;
