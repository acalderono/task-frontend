import React, { useState, useEffect } from "react";
import * as moment from "moment";
import { ReactComponent as KeySolid } from "./../assets/key-solid.svg";
import { ReactComponent as AitLogo } from "./../assets/ait-logo.svg";
import {
  Main,
  Section,
  Wrapper,
  Icon,
  Titles,
  Title,
  Subtitle,
  Hour,
  Inline,
  Content,
  ContentTitle,
  List,
  ProjectName,
  ProjectHour,
} from "./Styles";

export const isoCurrentWeekAndYear = () => {
  const currentWeek = moment().isoWeek();
  const currentYear = moment().isoWeekYear();
  return { currentWeek, currentYear };
};

export const Web = () => {
  const [isLoading, setLoading] = useState(true);
  const [customers, setCustomers] = useState();
  const { REACT_APP_HOST_URL } = process.env;
  const { currentWeek, currentYear } = isoCurrentWeekAndYear();

  const [year, setYear] = useState(currentYear);
  const [week, setWeek] = useState(currentWeek);

  useEffect(() => {
    const abortCtrl = new AbortController();
    const signal = abortCtrl.signal;
    const getFetchCustomer = async () => {
      let r = await fetch(
        `${REACT_APP_HOST_URL}/team/7/customers?year=${year}&week=${week}`,
        {
          method: "GET",
          signal,
        }
      );

      const { data } = await r.json().then();
      const uniqaAssig = [...new Set(data.map((o) => o.assignment))];

      let newAssignment = [];
      uniqaAssig.forEach((assig) => {
        const hoursOfAssignment = data
          .filter((o) => o.assignment === assig)
          .map((o) => o.hours)
          .reduce((a, b) => a + b, 0);

        const projects = data.filter((o) => o.assignment === assig);

        let addNew = {
          assignment: assig,
          is_customer: assig === "Cliente" ? true : false,
          hours: hoursOfAssignment,
          projects: sortByHours(projects),
        };
        newAssignment.push(addNew);
      });

      setCustomers(newAssignment);
      setLoading(false);
    };
    getFetchCustomer();

    return () => {
      // signal.abort();
      setLoading(false);
      console.log("cleaned up");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [REACT_APP_HOST_URL, week, year]);

  const MiniCard = (props) => {
    return (
      <Wrapper>
        <Icon>{props.is_customer ? <KeySolid /> : <AitLogo />}</Icon>
        <>
          <Titles>
            <Title>{props.assignment}</Title>
            <Subtitle></Subtitle>
          </Titles>
          <Hour>{props.hours}</Hour>
        </>
      </Wrapper>
    );
  };

  const handleChangeYear = (event) => {
    setYear(event.target.value);
  };

  const SelectYear = () => {
    const years = [currentYear - 1, currentYear];
    return (
      <label>
        Año
        <select onChange={handleChangeYear} defaultValue={year} disabled>
          {years.map((y, i) => (
            <option key={i} value={y} disabled>
              {y}
            </option>
          ))}
        </select>
      </label>
    );
  };

  const hanleChangeWeek = (event) => {
    setWeek(event.target.value);
  };

  const SelectWeek = () => {
    const weeksList = [
      { week: currentWeek - 1, name: "última semana" },
      { week: currentWeek, name: "semana actual" },
    ];
    return (
      <label>
        Fecha
        <select onChange={hanleChangeWeek} defaultValue={week}>
          {weeksList.map((wk, i) => (
            <option key={i} value={wk.week}>
              {wk.name}
            </option>
          ))}
        </select>
      </label>
    );
  };

  return (
    <>
      {isLoading ? (
        "Cargando..."
      ) : (
        <>
          <div>
            <SelectYear></SelectYear>
            <SelectWeek></SelectWeek>
          </div>
          <Main>
            {!customers.length ? (
              <div>Sin informacion</div>
            ) : (
              customers.map((customer, i) => (
                <Section key={i}>
                  <MiniCard key={i} {...customer}></MiniCard>
                  {customer.projects.map((project, j) => (
                    <Card key={j} week={week} year={year} {...project} />
                  ))}
                </Section>
              ))
            )}
          </Main>
        </>
      )}
    </>
  );
};

const Card = (props) => {
  const [projects, setProjects] = useState();
  const [isLoading, setLoading] = useState(true);
  const customer = props.customer;
  const year = props.year;
  const week = props.week;
  const { REACT_APP_HOST_URL } = process.env;

  useEffect(() => {
    const abortCtrl = new AbortController();
    const signal = abortCtrl.signal;

    const getFetch = async () => {
      let r = await fetch(
        `${REACT_APP_HOST_URL}/team/7/projects/${customer}?year=${year}&week=${week}`,
        {
          method: "GET",
          signal,
        }
      );

      let { data } = await r.json().then();
      setProjects(sortByHours(data));
      setLoading(false);
    };

    getFetch();

    return () => {
      // signal.abort();
      console.log("dismount card");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, year, week]);

  return (
    <Wrapper>
      <Icon>{props.is_customer ? <KeySolid /> : <AitLogo />}</Icon>
      <>
        <Titles>
          <Title>{props.customer}</Title>
          <Subtitle>{props.assignment}</Subtitle>
        </Titles>
        <Hour>{props.hours}</Hour>
      </>
      <Inline></Inline>
      <>
        {isLoading ? (
          <ContentTitle>Cargando...</ContentTitle>
        ) : (
          <>
            <ContentTitle>Proyectos</ContentTitle>
            <Content>
              {projects.map((p, i) => {
                return (
                  <List key={i}>
                    <ProjectName>{p.project}</ProjectName>
                    <ProjectHour>{p.hours}</ProjectHour>
                  </List>
                );
              })}
            </Content>
          </>
        )}
      </>
    </Wrapper>
  );
};

const sortByHours = (data = []) => {
  return data.sort((a, b) => b.hours - a.hours);
};
export default Web;
