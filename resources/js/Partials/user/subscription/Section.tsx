import styled from "styled-components";

const Section = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  width: 300px;
  gap: 30px;
  align-items: flex-start;
  &:not(:last-child) {
    padding-bottom: 38px;
  }
`;
export default Section;
