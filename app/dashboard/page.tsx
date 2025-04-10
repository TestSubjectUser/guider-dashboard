import { Suspense } from "react";
import Main from "../../components/create-your-comp/Main";

function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Main />
    </Suspense>
  );
}
export default DashboardPage;
