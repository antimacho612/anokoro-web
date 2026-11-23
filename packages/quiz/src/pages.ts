import personal1995 from "./pages/personal-1995.html?raw";
import personal1997 from "./pages/personal-1997.html?raw";
import personal2000 from "./pages/personal-2000.html?raw";
import personal2003 from "./pages/personal-2003.html?raw";
import personal2008 from "./pages/personal-2008.html?raw";
import personal2011 from "./pages/personal-2011.html?raw";
import corporate1996 from "./pages/corporate-1996.html?raw";
import corporate1997 from "./pages/corporate-1997.html?raw";
import corporate2003 from "./pages/corporate-2003.html?raw";
import corporate2006 from "./pages/corporate-2006.html?raw";
import corporate2011 from "./pages/corporate-2011.html?raw";
import portal1996 from "./pages/portal-1996.html?raw";
import portal1997 from "./pages/portal-1997.html?raw";
import portal2001 from "./pages/portal-2001.html?raw";
import portal2003 from "./pages/portal-2003.html?raw";
import bbs1996 from "./pages/bbs-1996.html?raw";
import bbs1997 from "./pages/bbs-1997.html?raw";
import bbs2000 from "./pages/bbs-2000.html?raw";
import bbs2005 from "./pages/bbs-2005.html?raw";
import shop1999 from "./pages/shop-1999.html?raw";
import shop2003 from "./pages/shop-2003.html?raw";
import shop2006 from "./pages/shop-2006.html?raw";
import shop2011 from "./pages/shop-2011.html?raw";
import blog2003 from "./pages/blog-2003.html?raw";
import blog2005 from "./pages/blog-2005.html?raw";
import blog2008 from "./pages/blog-2008.html?raw";
import blog2011 from "./pages/blog-2011.html?raw";
import type { QuizPage } from "./types.ts";

export const QUIZ_PAGES: readonly QuizPage[] = [
  {
    id: "personal-1995",
    kind: "personal",
    years: [1995, 1996],
    url: "http://www.hogespace.example/~taro/index.html",
    source: personal1995,
  },
  {
    id: "personal-1997",
    kind: "personal",
    years: [1997, 1999],
    url: "http://www.hogespace.example/~taro/index.html",
    source: personal1997,
  },
  {
    id: "personal-2000",
    kind: "personal",
    years: [2000, 2002],
    url: "http://www.hogespace.example/~kenji/index.html",
    source: personal2000,
  },
  {
    id: "personal-2003",
    kind: "personal",
    years: [2003, 2007],
    url: "http://www.hogespace.example/~hanako/index.html",
    source: personal2003,
  },
  {
    id: "personal-2008",
    kind: "personal",
    years: [2008, 2010],
    url: "http://www.hogespace.example/~jiro/index.html",
    source: personal2008,
  },
  {
    id: "personal-2011",
    kind: "personal",
    years: [2011, 2015],
    url: "http://hanako.hogespace.example/",
    source: personal2011,
  },
  {
    id: "corporate-1996",
    kind: "corporate",
    years: [1996, 1996],
    url: "http://www.hogehoge-seika.example/",
    source: corporate1996,
  },
  {
    id: "corporate-1997",
    kind: "corporate",
    years: [1997, 2002],
    url: "http://www.hogehoge-seika.example/",
    source: corporate1997,
  },
  {
    id: "corporate-2003",
    kind: "corporate",
    years: [2003, 2005],
    url: "http://www.hogehoge-seika.example/",
    source: corporate2003,
  },
  {
    id: "corporate-2006",
    kind: "corporate",
    years: [2006, 2010],
    url: "http://www.hogehoge-seika.example/",
    source: corporate2006,
  },
  {
    id: "corporate-2011",
    kind: "corporate",
    years: [2011, 2015],
    url: "http://www.hogehoge-seika.example/",
    source: corporate2011,
  },
  {
    id: "portal-1996",
    kind: "portal",
    years: [1996, 1996],
    url: "http://www.hogenavi.example/",
    source: portal1996,
  },
  {
    id: "portal-1997",
    kind: "portal",
    years: [1997, 2000],
    url: "http://www.hogenavi.example/",
    source: portal1997,
  },
  {
    id: "portal-2001",
    kind: "portal",
    years: [2001, 2002],
    url: "http://www.hogenavi.example/",
    source: portal2001,
  },
  {
    id: "portal-2003",
    kind: "portal",
    years: [2003, 2005],
    url: "http://www.hogenavi.example/",
    source: portal2003,
  },
  {
    id: "bbs-1996",
    kind: "bbs",
    years: [1996, 1996],
    url: "http://www.hogespace.example/~taro/cgi-bin/bbs.cgi",
    source: bbs1996,
  },
  {
    id: "bbs-1997",
    kind: "bbs",
    years: [1997, 1999],
    url: "http://bbs.hogespace.example/zatsudan/index.html",
    source: bbs1997,
  },
  {
    id: "bbs-2000",
    kind: "bbs",
    years: [2000, 2004],
    url: "http://bbs.hogespace.example/hobby/3.html",
    source: bbs2000,
  },
  {
    id: "bbs-2005",
    kind: "bbs",
    years: [2005, 2015],
    url: "http://bbs.hogespace.example/zatsudan/12.html",
    source: bbs2005,
  },
  {
    id: "shop-1999",
    kind: "shop",
    years: [1999, 2002],
    url: "http://shop.hogehoge.example/umeboshi.html",
    source: shop1999,
  },
  {
    id: "shop-2003",
    kind: "shop",
    years: [2003, 2005],
    url: "http://shop.hogehoge.example/umeboshi.html",
    source: shop2003,
  },
  {
    id: "shop-2006",
    kind: "shop",
    years: [2006, 2010],
    url: "http://shop.hogehoge.example/item/umeboshi.html",
    source: shop2006,
  },
  {
    id: "shop-2011",
    kind: "shop",
    years: [2011, 2015],
    url: "http://shop.hogehoge.example/item/umeboshi",
    source: shop2011,
  },
  {
    id: "blog-2003",
    kind: "blog",
    years: [2003, 2004],
    url: "http://blog.hogespace.example/jiro/",
    source: blog2003,
  },
  {
    id: "blog-2005",
    kind: "blog",
    years: [2005, 2007],
    url: "http://blog.hogespace.example/hanako/",
    source: blog2005,
  },
  {
    id: "blog-2008",
    kind: "blog",
    years: [2008, 2010],
    url: "http://blog.hogespace.example/hanako/",
    source: blog2008,
  },
  {
    id: "blog-2011",
    kind: "blog",
    years: [2011, 2015],
    url: "http://blog.hogespace.example/hanako/",
    source: blog2011,
  },
];
