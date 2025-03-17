import React, { Suspense } from "react";
import Dashboard from "../../components/create-your-comp/Dashboard";
import Main from "../../components/create-your-comp/Main";
function page() {
  return (
    <div>
      {/* <Dashboard /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Main />
      </Suspense>
    </div>
  );
}

export default page;
