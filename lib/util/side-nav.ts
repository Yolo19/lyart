import { memoize } from "lodash";
import { useRouter } from "next/router";
import { useUserRole } from "../../components/custom-hooks/login-state";
import { SideNav } from "../model/constant/routes";
import { Role } from "../../lib/model/role";

/**
 * 获取当前活动的sideNav
 */
export const getActiveKey = (data: SideNav[]) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const activeRoute = omitDetailPath(router.pathname);
  const { paths, keys } = memoizedGetKeyPathInfo(data);
  const isEqual = isPathEqual(activeRoute);
  const index = paths.findIndex(isEqual);

  return keys[index] || "";
};

/**
 * 根据路由信息找出生成当前side nav 的 key，path 信息
 */
export const getKeyPathInfo = (
  data: SideNav[]
): { keys: string[]; paths: string[] } => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const userRole = useUserRole();
  const getPaths = generateFactory(generatePath);
  const paths = getPaths(data)
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map((item) =>
      ["/dashboard", userRole, item].filter((item) => !!item).join("/")
    );
  const getKeys = generateFactory(generateKey);
  const keys = getKeys(data).reduce((acc, cur) => [...acc, ...cur], []);

  return { keys, paths };
};

/**
 * getKeyPathInfo 的缓存版本，避免获取相同的sideNav的key path时递归过程重复执行
 */
const memoizedGetKeyPathInfo = memoize(getKeyPathInfo, (data) =>
  data.map((item) => item.title).join("_")
);

/**
 * 生成key
 */
export const generateKey = (data: SideNav, index: number): string => {
  return `${data.title}_${index}`;
};

/**
 * 生成路径
 * @param data - side nav config
 */
const generatePath = (data: SideNav): string => {
  return data.path.join("/");
};

/**
 * 忽略详情路径上的参数路径
 */
export const omitDetailPath = (path: string): string => {
  const isDetail = isDetailPath(path);

  return isDetail ? path.slice(0, path.lastIndexOf("/")) : path;
};

/**
 * 判断当前路径是否指向一个详情页
 */
const isDetailPath = (path: string): boolean => {
  const paths = path.split("/");
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

export const isPathEqual = (target: string) => (current: string) => {
  current = current.endsWith("/") ? current.slice(0, -1) : current;

  return current === target;
};

/**
 * 生成key 或 path 的工厂函数
 * @param fn - 生成key或path的函数
 * @return - 执行函数
 */
export const generateFactory = (fn: (data: SideNav, index: number) => string) =>
  function inner(data: SideNav[], current = ""): string[][] {
    const keys = data.map((item, index) => {
      let key = fn(item, index);

      if (current) {
        key = [current, key].join("/");
      }

      if (item.subNav && !!item.subNav.length) {
        return inner(item.subNav, key).map((item) => item.join("/"));
      } else {
        return [key];
      }
    });

    return keys;
  };

/**
 * 根据路径获取sideNav名称
 */
export const getSideNavNameByPath = (
  data: SideNav[],
  path: string
): string[] => {
  const isDetail = isDetailPath(path);

  path = isDetail ? path.split("/").slice(0, -1).join("/") : path;

  const { paths, keys } = memoizedGetKeyPathInfo(data);
  const isEqual = isPathEqual(path);
  const index = paths.findIndex(isEqual);
  const result = getSideNavNameByKey(keys[index]);

  return isDetail ? [...result, "Detail"] : result;
};

/**
 *  通过key获取当前sideNav的名称，也就是label
 */
export const getSideNavNameByKey = (key: string): string[] => {
  return key.split("/").map((item) => item.split("_")[0]);
};
