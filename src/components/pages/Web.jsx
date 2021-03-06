import React, { useState, useEffect } from 'react';
import * as moment from 'moment';
import { ReactComponent as KeySolid } from './../assets/key-solid.svg';
import { ReactComponent as AitLogo } from './../assets/ait-logo.svg';
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
} from './Styles';

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

  const [teamId, setTeamId] = useState(7);
  const [year, setYear] = useState(currentYear);
  const [week, setWeek] = useState(currentWeek);

  useEffect(() => {
    const abortCtrl = new AbortController();
    const signal = abortCtrl.signal;
    const getFetchCustomer = async () => {
      let r = await fetch(
        `${REACT_APP_HOST_URL}/team/${teamId}/customers?year=${year}&week=${week}`,
        {
          method: 'GET',
          mode: 'cors',
          signal,
        }
      );

      let { data } = await r.json().then();

      const uniqaAssig = [...new Set(data.map((o) => o.assignment))];
      const newData = [...data];
      console.log(data);

      const sortedData = newData.sort((a, b) =>
        a.customer > b.customer ? 1 : -1
      );

      console.log(sortedData);
      let orderedData = [];
      for (let [index, value] of sortedData.entries()) {
        if (
          value.customer &&
          sortedData[index + 1] &&
          value.customer === sortedData[index + 1].customer &&
          value.week === sortedData[index + 1].week
        ) {
          orderedData.push({
            is_customer: value.assignment === 'Cliente' ? true : false,
            assignment: value.assignment,
            customer: value.customer,
            hours: value.hours + sortedData[index + 1].hours,
          });
        } else {
          orderedData.push({
            is_customer: value.assignment === 'Cliente' ? true : false,
            assignment: value.assignment,
            customer: value.customer,
            hours: value.hours,
          });
        }
      }
      const result = orderedData.filter(
        (v, i, a) => a.findIndex((t) => t.customer === v.customer) === i
      );

      let newAssignment = [];
      uniqaAssig.forEach((assig) => {
        const hoursOfAssignment = data
          .filter((o) => o.assignment === assig)
          .map((o) => o.hours)
          .reduce((a, b) => a + b, 0);
        const projects = result.filter((o) => o.assignment === assig);
        let addNew = {
          assignment: assig,
          is_customer: assig === 'Cliente' ? true : false,
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
      console.log('cleaned up');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [REACT_APP_HOST_URL, week, year, teamId]);

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
        A??o
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

  const handleChangeWeek = (event) => {
    setWeek(event.target.value);
  };

  const SelectWeek = () => {
    const weeksList = [
      { week: currentWeek - 1, name: '??ltima semana' },
      { week: currentWeek, name: 'semana actual' },
    ];
    return (
      <label>
        Fecha
        <select onChange={handleChangeWeek} defaultValue={week}>
          {weeksList.map((wk, i) => (
            <option key={i} value={wk.week}>
              {wk.name}
            </option>
          ))}
        </select>
      </label>
    );
  };

  const handleChangeTeam = (event) => {
    console.log(event.target.value);
    setTeamId(event.target.value);
  };

  const SelectTeam = () => {
    const teamList = [
      {
        id_team: 52,
        team: 'Fabrica Siebel (CL)',
        status: 'Activo',
      },
      {
        id_team: 53,
        team: 'Infraestructura',
        status: 'Activo',
      },
      {
        id_team: 7,
        team: 'Fabrica Desarrollo',
        status: 'Activo',
      },
      {
        id_team: 59,
        team: 'Fabrica Siebel (CO)',
        status: 'Activo',
      },
      {
        id_team: 60,
        team: 'KAM',
        status: 'Activo',
      },
      {
        id_team: 104,
        team: 'Grupo CO/DO',
        status: 'Activo',
      },
    ];

    return (
      <label>
        Equipo
        <select onChange={handleChangeTeam} defaultValue={teamId}>
          {teamList.map((item, i) => (
            <option
              key={i}
              value={item.id_team}
              disabled={item.status !== 'Activo'}
            >
              {item.team}
            </option>
          ))}
        </select>
      </label>
    );
  };

  return (
    <>
      {isLoading ? (
        'Cargando...'
      ) : (
        <>
          <div>
            <SelectYear />
            <SelectWeek />
            <SelectTeam />
          </div>
          <Main>
            {!customers.length ? (
              <div>
                No hay informaci??n, intenta m??s tarde o pide que imputen las HH
                ;P
              </div>
            ) : (
              customers.map((customer, i) => (
                <Section key={i}>
                  <MiniCard key={i} {...customer}></MiniCard>
                  {customer.projects.map((project, j) => (
                    <Card
                      key={j}
                      week={week}
                      year={year}
                      teamId={teamId}
                      {...project}
                    />
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
  const teamId = props.teamId;
  const customer = props.customer;
  const year = props.year;
  const week = props.week;
  const { REACT_APP_HOST_URL } = process.env;

  useEffect(() => {
    const abortCtrl = new AbortController();
    const signal = abortCtrl.signal;

    const getFetch = async () => {
      let r = await fetch(
        `${REACT_APP_HOST_URL}/team/${teamId}/projects/${customer}?year=${year}&week=${week}`,
        {
          method: 'GET',
          mode: 'cors',
          signal,
        }
      );

      let { data } = await r.json().then();
      const newData = [...data];

      const sortedData = newData.sort((a, b) =>
        a.project > b.project ? 1 : -1
      );
      let orderedData = [];
      for (let [index, value] of sortedData.entries()) {
        if (
          value.project &&
          sortedData[index + 1] &&
          value.project === sortedData[index + 1].project &&
          value.week === sortedData[index + 1].week
        ) {
          orderedData.push({
            assignment: value.assignment,
            customer: value.customer,
            hours: value.hours + sortedData[index + 1].hours,
            project: value.project,
          });
        } else {
          orderedData.push({
            assignment: value.assignment,
            customer: value.customer,
            hours: value.hours,
            project: value.project,
          });
        }
      }
      const result = orderedData.filter(
        (v, i, a) => a.findIndex((t) => t.project === v.project) === i
      );

      setProjects(sortByHours(result));
      setLoading(false);
    };

    getFetch();

    return () => {
      // signal.abort();
      console.log('dismount card');
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

// const TableSection = () => {
//   const [users, setUsers] = useState();
//   const [isLoading, setLoading] = useState(true);
//   const titles = ['Equipo', 'Nombre', 'Proyecto', 'Hora'];

//   const { REACT_APP_HOST_URL } = process.env;

//   useEffect(() => {
//     const abortCtrl = new AbortController();
//     const signal = abortCtrl.signal;

//     const getFetch = async () => {
//       let r = await fetch(`${REACT_APP_HOST_URL}/api/team/7`, {
//         method: 'GET',
//         signal,
//       });

//       let { data } = await r.json().then();
//       let list = data.map((o) => ({
//         team: o.team,
//         initial: getFirstCharacter(o.firstname).concat(
//           getFirstCharacter(o.lastname)
//         ),
//         username: o.user,
//         firstname: o.firstname,
//         lastname: o.lastname,
//         assignment: o.assignment,
//         customer: o.customer,
//         hours: o.hours,
//         year: o.year,
//         week: o.week,
//         project: o.project,
//       }));

//       setUsers(list);
//       setLoading(false);
//     };

//     getFetch();

//     return () => {
//       // signal.abort();
//       console.log('dismount card');
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <>
//       {isLoading ? (
//         <ContentTitle>Cargando...</ContentTitle>
//       ) : (
//         <Table>
//           <THead>
//             <Tr>
//               {titles.map((t, i) => (
//                 <Th key={i}>{t}</Th>
//               ))}
//             </Tr>
//           </THead>
//           <TBody>
//             {users.map((u, i) => (
//               <Tr key={i}>
//                 <Td>{u.team}</Td>
//                 <Td>
//                   <Letter letters={u.initial} color={'green'}></Letter>
//                   {u.firstname} {u.lastname}
//                 </Td>
//                 <Td>
//                   <Project>
//                     <span className="asigg">{u.assignment}</span>
//                     <span style={{ fontSize: '18px' }}>{u.project}</span>
//                     <span className="customer">{u.customer} </span>
//                   </Project>
//                 </Td>
//                 <Td>{u.hours}</Td>
//               </Tr>
//             ))}
//           </TBody>
//         </Table>
//       )}
//     </>
//   );
// };

const sortByHours = (data = []) => {
  return data.sort((a, b) => b.hours - a.hours);
};

// const getColor = () => {
//   return '#' + Math.floor(Math.random() * 16777215).toString(16);
// };

// const getFirstCharacter = (string) => string.charAt(0).toUpperCase();
// const groupBy = (array, key) => {
//   // Return the end result
//   return array.reduce((result, currentValue) => {
//     // If an array already present for key, push it to the array. Else create an array and push the object
//     (result[currentValue[key]] = result[currentValue[key]] || []).push(
//       currentValue
//     );
//     // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
//     return result;
//   }, {}); // empty object is the initial value for result object
// };

export default Web;
