import React, { lazy, Suspense } from "react";
import { Links } from "./links";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Loader } from "../components/pacman-loader";
export const Path = [
  { path: Links.root, component: lazy(() => import("../App")) },
  { path: Links.settings, component: lazy(() => import("../blog-settings/blog-settings.view")) },
  { path: Links.posts, component: lazy(() => import("../blog/posts.view")) },
  { path: Links.post, component: lazy(() => import("../blog/post.view")) },
  { path: Links.Linq, component: lazy(() => import("../libs/linq.view")) }
];

const Routes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader width="10rem" />}>
        <Switch>
          {Path.map((x) => (
            <Route key={x.path} exact path={x.path} component={x.component} />
          ))}
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
