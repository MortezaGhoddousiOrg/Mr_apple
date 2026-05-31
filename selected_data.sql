--
-- PostgreSQL database dump
--

\restrict va19bTLChy5TUJLdfYbWULcB0FVpxgaPBdKzKqBbBmuc4SAWJyaXt9QB0bzypsJ

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: category_parent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category_parent (id, title, image) FROM stdin;
1	Mobile	\N
2	mobile	images/categories/Capture1.PNG
\.


--
-- Data for Name: category_child; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category_child (id, title, image, parent_id) FROM stdin;
2	iPhone		1
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, product_code, name, buy_price, sell_price, discount, quantity, descriptions, feature, status, created_at, updated_at, category_id) FROM stdin;
1	\N	iPhone 15 Pro Max	\N	85000.00	0.00	5	\N	\N	active	2026-05-19 14:26:28.515018+03:30	2026-05-19 14:26:28.515018+03:30	\N
2	\N	iPhone 15 Pro Max	\N	85000.00	0.00	5	\N	\N	active	2026-05-19 14:29:33.449866+03:30	2026-05-19 14:29:33.449866+03:30	\N
3	AP_123	test	10000.00	500000.00	0.00	2	\N	\N	deactive	2026-05-19 14:46:21.902652+03:30	2026-05-19 14:46:21.902652+03:30	\N
4	AP_123	test	10000.00	500000.00	0.00	2	test description	\N	deactive	2026-05-19 14:56:37.434624+03:30	2026-05-19 14:56:37.435633+03:30	\N
5	AP_123	test	10000.00	500000.00	0.00	2	test description	[{"brand": "apple"}, {"partnumber": "ZAA"}]	deactive	2026-05-19 14:57:19.155614+03:30	2026-05-19 14:57:19.155614+03:30	\N
6	IP14	iPhone 14	1000.00	1500.00	0.00	5	\N	\N	active	2026-05-20 12:37:00.887916+03:30	2026-05-20 12:37:00.887916+03:30	2
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, image, is_main, created_at, product_id) FROM stdin;
2	images/products/210b2ae6-bf89-4c0f-8dbc-968c2b2001e1.PNG	t	2026-05-19 13:38:33.046264+03:30	\N
1	images/products/a454d249-c376-4321-8ba5-f3c71910baf8.jpeg	t	2026-05-19 13:32:10.474617+03:30	2
3	images/products/9515a551-65a6-49b8-be02-6c7487d9fc20.PNG	t	2026-05-19 14:40:01.353769+03:30	5
4	images/products/2ca7ef1f-6e33-44e2-95b3-af9d36033438.PNG	f	2026-05-19 14:40:22.935827+03:30	5
\.


--
-- Name: category_child_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_child_id_seq', 2, true);


--
-- Name: category_parent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_parent_id_seq', 2, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 5, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--

\unrestrict va19bTLChy5TUJLdfYbWULcB0FVpxgaPBdKzKqBbBmuc4SAWJyaXt9QB0bzypsJ

