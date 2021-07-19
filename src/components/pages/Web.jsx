import React, { useState, useEffect } from "react";

export const Web = () => {
  const [isLoading, setLoading] = useState(true);
  const [customers, setCustomers] = useState();
  const [projects, setProjects] = useState();
  // const { REACT_APP_TOKEN_GITHUB } = process.env;

  const getFetchCustomer = async () => {
    let r = await fetch("https://demo6760039.mockable.io/team/7/customers", {
      method: "GET",
      //   headers: new Headers({
      //     Authorization: REACT_APP_TOKEN_GITHUB,
      //   }),
    });
    let list = await r.json().then();
    setCustomers(list.data);
    console.log(list);
    setLoading(false);
  };

  useEffect(() => {
    getFetchCustomer();
  }, []);

  return (
    <>
      {isLoading
        ? "Cargando...."
        : customers.map((c, i) => {
            return (
              <div key={i}>
                {c.assignment} - {c.customer} - {c.hours} - {c.week}
              </div>
            );
          })}
    </>
  );
};

export default Web;
