import styled from "styled-components";

const theme = {
  color: {
    light: "#FFF",
    dark: "#333333",
    primary: "#32753A",
    secondary: "#636363",
    tertiary: "#B0CD53",
  },
};

export const Main = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 1rem 2rem;
`;

export const Section = styled.section`
  display: flex;
  justify-content: flex-start;
  padding-right: 1rem;
  padding-left: 1rem;
  user-select: none;
  background: rgb(248, 248, 248);
  overflow: scroll;
`;

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 15em;
  min-width: 15em;
  text-align: center;
  background-color: white;
  margin: 1rem 0.5rem;
  border-radius: 10px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background: ${theme.color.light};
  box-shadow: 0 4px 14px 0 ${theme.color.secondary};
`;

export const Icon = styled.div`
  position: absolute;
  width: 1.5em;
  top: 1rem;
  right: 1rem;
  color: ${theme.color.secondary};
`;

export const Titles = styled.div`
  display: flex;
  flex-flow: column nowrap;
  text-align: left;
  padding-left: 1rem;
  margin-bottom: 1rem;
`;

export const Title = styled.div`
  font-size: 1em;
  font-weight: bold;
  color: ${theme.color.primary};
`;

export const Subtitle = styled.div`
  font-size: 1rem;
  color: ${theme.color.secondary};
`;
export const Hour = styled.div`
  font-size: 4rem;
  font-weight: 100;
  color: ${theme.color.primary};
  &:after {
    content: " /HR";
    font-size: 0.5em;
  }
`;

export const Inline = styled.div`
  border-bottom: 1px solid ${theme.color.primary};
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 80%;
  margin: auto;
`;

export const Content = styled.ul`
  list-style-type: none;
  text-align: left;
  padding: 0px;
  margin-left: 1rem;
  margin-right: 1rem;
`;

export const ContentTitle = styled.div`
  font-size: 1em;
  text-align: left;
  padding-left: 1rem;
  margin-top: 1rem;
  font-weight: 600;
  color: ${theme.color.tertiary};
`;

export const List = styled.li`
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  font-size: 0.7rem;
`;

export const ProjectName = styled.div`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  padding-right: 1rem;
  color: ${theme.color.secondary};
  text-transform: uppercase;
`;

export const ProjectHour = styled.div`
  font-weight: 800;
  color: ${theme.color.secondary};
  &:after {
    content: "/HH";
    color: ${theme.color.tertiary};
  }
`;

export const Table = styled.table`
  display: grid;
  border-collapse: collapse;
  min-width: 100%;
  font-size: 0.8rem;
  grid-template-columns: [equipo] 10rem [nombre] 10rem [proyecto] 0.5fr [hora] 0.2fr;
  margin-right: 1em;
  margin-left: 1em;
`;
export const THead = styled.thead`
  display: contents;
`;
export const TBody = styled.tbody`
  display: contents;
`;
export const Tr = styled.tr`
  display: contents;
`;
export const Td = styled.td`
  padding: 5px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const Th = styled.th`
  padding: 5px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Project = styled.div`
  display: flex;
  flex-direction: column;
`;
// export const Letter = <styled className="div attrs"></styled>
// [data-letters]:before {
//   content:attr(data-letters);
//   display:inline-block;
//   font-size:1em;
//   width:2.5em;
//   height:2.5em;
//   line-height:2.5em;
//   text-align:center;
//   border-radius:50%;
//   background:plum;
//   vertical-align:middle;
//   margin-right:1em;
//   color:white;
//   }

export const Letter = styled.div.attrs((props) => ({
  "data-letters": props.letters,
}))`
  &:before {
    content: attr(data-letters);
    display: inline-block;
    font-size: 1em;
    width: 2.5em;
    height: 2.5em;
    line-height: 2.5em;
    text-align: center;
    border-radius: 50%;
    background: ${(props) => (props.color ? props.color : "pink")};
    vertical-align: middle;
    margin-right: 1em;
    color: white;
  }
`;
