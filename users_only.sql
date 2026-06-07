--
-- PostgreSQL database dump
--

\restrict HaEsX51AQlSyPuetOZiHjnWkfbLmIBdNKlZQBjmhCWFS3AXulkhhsmkE1l0hOQE

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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, firstname, lastname, phone, email, role, created_at, updated_at, status) FROM stdin;
1	ali	karami	091200000000	ali@example.com	customer	2026-02-17 08:50:36	2026-05-17 09:50:41	active
2	amir ali	javadi	09152000325	amirali@example.com	admin	2025-05-17 07:51:46	2026-05-17 12:51:51	active
3	sara	mohammadi	09902586359	sara@example.com	customer	2025-12-02 23:52:50	2026-01-17 20:33:05	active
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict HaEsX51AQlSyPuetOZiHjnWkfbLmIBdNKlZQBjmhCWFS3AXulkhhsmkE1l0hOQE

