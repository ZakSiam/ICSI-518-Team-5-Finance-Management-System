--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: add_expense(integer, numeric, character varying, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_expense(p_user_id integer, p_amount numeric, p_category character varying, p_description text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO expenses (user_id, amount, category, description)
    VALUES (p_user_id, p_amount, p_category, p_description);
END;
$$;


ALTER FUNCTION public.add_expense(p_user_id integer, p_amount numeric, p_category character varying, p_description text) OWNER TO postgres;

--
-- Name: add_recurring_payment(integer, numeric, character varying, text, timestamp without time zone, interval); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_recurring_payment(p_user_id integer, p_amount numeric, p_category character varying, p_description text, p_start_date timestamp without time zone, p_frequency interval) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO recurring_payments (user_id, amount, category, description, start_date, frequency)
    VALUES (p_user_id, p_amount, p_category, p_description, p_start_date, p_frequency);
END;
$$;


ALTER FUNCTION public.add_recurring_payment(p_user_id integer, p_amount numeric, p_category character varying, p_description text, p_start_date timestamp without time zone, p_frequency interval) OWNER TO postgres;

--
-- Name: edit_expense(integer, numeric, character varying, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.edit_expense(p_expense_id integer, p_amount numeric, p_category character varying, p_description text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE expenses
    SET amount = p_amount, category = p_category, description = p_description
    WHERE expense_id = p_expense_id;
END;
$$;


ALTER FUNCTION public.edit_expense(p_expense_id integer, p_amount numeric, p_category character varying, p_description text) OWNER TO postgres;

--
-- Name: process_recurring_payments(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_recurring_payments() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT * FROM recurring_payments 
        WHERE start_date <= NOW() 
    LOOP
        INSERT INTO expenses (user_id, amount, category, description, expense_date)
        VALUES (rec.user_id, rec.amount, rec.category, rec.description, NOW());
        
        -- Update the next payment date (extend the start date by the frequency)
        UPDATE recurring_payments
        SET start_date = start_date + rec.frequency
        WHERE payment_id = rec.payment_id;
    END LOOP;
END;
$$;


ALTER FUNCTION public.process_recurring_payments() OWNER TO postgres;

--
-- Name: register_user(character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.register_user(p_username character varying, p_password_hash character varying, p_email character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO users (username, password_hash, email)
    VALUES (p_username, p_password_hash, p_email);
END;
$$;


ALTER FUNCTION public.register_user(p_username character varying, p_password_hash character varying, p_email character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    expense_id integer NOT NULL,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    category character varying(50) NOT NULL,
    description text,
    expense_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenses_expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_expense_id_seq OWNER TO postgres;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenses_expense_id_seq OWNED BY public.expenses.expense_id;


--
-- Name: recurring_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recurring_payments (
    payment_id integer NOT NULL,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    category character varying(50) NOT NULL,
    description text,
    start_date timestamp without time zone NOT NULL,
    frequency interval NOT NULL
);


ALTER TABLE public.recurring_payments OWNER TO postgres;

--
-- Name: recurring_payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recurring_payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recurring_payments_payment_id_seq OWNER TO postgres;

--
-- Name: recurring_payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recurring_payments_payment_id_seq OWNED BY public.recurring_payments.payment_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: expenses expense_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses ALTER COLUMN expense_id SET DEFAULT nextval('public.expenses_expense_id_seq'::regclass);


--
-- Name: recurring_payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_payments ALTER COLUMN payment_id SET DEFAULT nextval('public.recurring_payments_payment_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (expense_id, user_id, amount, category, description, expense_date) FROM stdin;
1	1	50.00	food	Groceries at Walmart	2024-09-01 10:30:00
2	1	20.00	transportation	Uber ride to the office	2024-09-02 08:15:00
3	2	100.00	utilities	Electricity bill	2024-09-03 12:00:00
4	3	200.00	rent	September Rent	2024-09-05 09:00:00
5	1	10.00	entertainment	Movie ticket	2024-09-07 19:00:00
\.


--
-- Data for Name: recurring_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recurring_payments (payment_id, user_id, amount, category, description, start_date, frequency) FROM stdin;
1	1	1500.00	rent	Monthly rent payment	2024-09-01 00:00:00	1 mon
2	2	20.00	subscriptions	Spotify subscription	2024-09-10 00:00:00	1 mon
3	3	15.00	subscriptions	Netflix subscription	2024-09-15 00:00:00	1 mon
4	1	50.00	utilities	Water bill	2024-09-05 00:00:00	1 mon
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password_hash, email, created_at) FROM stdin;
1	john_doe	hashed_password1	john_doe@example.com	2024-09-29 20:11:45.070068
2	jane_smith	hashed_password2	jane_smith@example.com	2024-09-29 20:11:45.070068
3	alice_wonder	hashed_password3	alice_wonder@example.com	2024-09-29 20:11:45.070068
\.


--
-- Name: expenses_expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_expense_id_seq', 5, true);


--
-- Name: recurring_payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recurring_payments_payment_id_seq', 4, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);


--
-- Name: recurring_payments recurring_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_payments
    ADD CONSTRAINT recurring_payments_pkey PRIMARY KEY (payment_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: expenses expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: recurring_payments recurring_payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recurring_payments
    ADD CONSTRAINT recurring_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

