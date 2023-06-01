PGDMP             
            {         	   Ecommerce    15.2    15.2 -    6           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            7           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            8           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            9           1262    16555 	   Ecommerce    DATABASE     m   CREATE DATABASE "Ecommerce" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE "Ecommerce";
                postgres    false            �            1259    16589    cart    TABLE     �   CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer NOT NULL,
    item_id integer NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.cart;
       public         heap    postgres    false            �            1259    16588    cart_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.cart_id_seq;
       public          postgres    false    219            :           0    0    cart_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;
          public          postgres    false    218            �            1259    16565    item    TABLE       CREATE TABLE public.item (
    id integer NOT NULL,
    user_id integer,
    item_name character varying(255),
    item_image character varying(255),
    description text,
    price numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.item;
       public         heap    postgres    false            �            1259    16564    item_id_seq    SEQUENCE     �   CREATE SEQUENCE public.item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.item_id_seq;
       public          postgres    false    217            ;           0    0    item_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.item_id_seq OWNED BY public.item.id;
          public          postgres    false    216            �            1259    16607    orders    TABLE       CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    address text NOT NULL,
    order_details jsonb,
    created_at timestamp without time zone DEFAULT now(),
    payment_method jsonb
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    16606    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public          postgres    false    221            <           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public          postgres    false    220            �            1259    16663    product_reviews    TABLE     �   CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    item_id integer NOT NULL,
    rating integer NOT NULL,
    review_text text,
    created_at timestamp without time zone DEFAULT now()
);
 #   DROP TABLE public.product_reviews;
       public         heap    postgres    false            �            1259    16662    product_reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.product_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.product_reviews_id_seq;
       public          postgres    false    223            =           0    0    product_reviews_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.product_reviews_id_seq OWNED BY public.product_reviews.id;
          public          postgres    false    222            �            1259    16557    registrations    TABLE     �   CREATE TABLE public.registrations (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(200) NOT NULL
);
 !   DROP TABLE public.registrations;
       public         heap    postgres    false            �            1259    16556    registrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.registrations_id_seq;
       public          postgres    false    215            >           0    0    registrations_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;
          public          postgres    false    214            �           2604    16592    cart id    DEFAULT     b   ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);
 6   ALTER TABLE public.cart ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            �           2604    16568    item id    DEFAULT     b   ALTER TABLE ONLY public.item ALTER COLUMN id SET DEFAULT nextval('public.item_id_seq'::regclass);
 6   ALTER TABLE public.item ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            �           2604    16610 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221            �           2604    16666    product_reviews id    DEFAULT     x   ALTER TABLE ONLY public.product_reviews ALTER COLUMN id SET DEFAULT nextval('public.product_reviews_id_seq'::regclass);
 A   ALTER TABLE public.product_reviews ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    223    223            �           2604    16560    registrations id    DEFAULT     t   ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);
 ?   ALTER TABLE public.registrations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            /          0    16589    cart 
   TABLE DATA           Q   COPY public.cart (id, user_id, item_id, quantity, price, created_at) FROM stdin;
    public          postgres    false    219   3       -          0    16565    item 
   TABLE DATA           b   COPY public.item (id, user_id, item_name, item_image, description, price, created_at) FROM stdin;
    public          postgres    false    217   �3       1          0    16607    orders 
   TABLE DATA           n   COPY public.orders (id, user_id, total_price, address, order_details, created_at, payment_method) FROM stdin;
    public          postgres    false    221   �4       3          0    16663    product_reviews 
   TABLE DATA           `   COPY public.product_reviews (id, user_id, item_id, rating, review_text, created_at) FROM stdin;
    public          postgres    false    223   B5       +          0    16557    registrations 
   TABLE DATA           F   COPY public.registrations (id, username, email, password) FROM stdin;
    public          postgres    false    215   �5       ?           0    0    cart_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.cart_id_seq', 1, true);
          public          postgres    false    218            @           0    0    item_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.item_id_seq', 4, true);
          public          postgres    false    216            A           0    0    orders_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.orders_id_seq', 1, true);
          public          postgres    false    220            B           0    0    product_reviews_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.product_reviews_id_seq', 2, true);
          public          postgres    false    222            C           0    0    registrations_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.registrations_id_seq', 5, true);
          public          postgres    false    214            �           2606    16595    cart cart_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_pkey;
       public            postgres    false    219            �           2606    16573    item item_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.item DROP CONSTRAINT item_pkey;
       public            postgres    false    217            �           2606    16615    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    221            �           2606    16671 $   product_reviews product_reviews_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.product_reviews DROP CONSTRAINT product_reviews_pkey;
       public            postgres    false    223            �           2606    16562     registrations registrations_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.registrations DROP CONSTRAINT registrations_pkey;
       public            postgres    false    215            �           2606    16601    cart cart_item_id_fkey    FK CONSTRAINT     t   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.item(id);
 @   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_item_id_fkey;
       public          postgres    false    217    3471    219            �           2606    16596    cart cart_user_id_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.registrations(id);
 @   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_user_id_fkey;
       public          postgres    false    215    219    3469            �           2606    16574    item item_user_id_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.registrations(id);
 @   ALTER TABLE ONLY public.item DROP CONSTRAINT item_user_id_fkey;
       public          postgres    false    3469    215    217            �           2606    16677 /   product_reviews product_reviews_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (item_id) REFERENCES public.item(id);
 Y   ALTER TABLE ONLY public.product_reviews DROP CONSTRAINT product_reviews_product_id_fkey;
       public          postgres    false    223    217    3471            �           2606    16672 ,   product_reviews product_reviews_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.registrations(id);
 V   ALTER TABLE ONLY public.product_reviews DROP CONSTRAINT product_reviews_user_id_fkey;
       public          postgres    false    3469    215    223            �           2606    16616    orders user_id    FK CONSTRAINT     u   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.registrations(id);
 8   ALTER TABLE ONLY public.orders DROP CONSTRAINT user_id;
       public          postgres    false    3469    215    221            /      x������ � �      -   �   x�uνN�0��~
? 6�'NoK%$�*��u������"D+��ѽ�|(Pl�2t�:L�������³3E����B?5qV�	k,U5+Dh�\=m�П�F�Ɛ��� ��/Uޮ��Y&)�oc�v���gd��s�q��?�H�lBh�u�_�ڻ�vnT����e�=�K�����\��:M�o���yWw���b���=۟����Ru������X;-���H)��Rm      1   �   x�U���0E���X�,�vb�_Q�T��%
H&���a��>����E!�  H�Q|{x�Wv�4��ץ���(����L��/�c�CBL��w�����"�dPd�K0e
3p8�u���n�#D4�WܹE�����݆n�����IO�K)?tG5�      3   Z   x�M˱� �:����Qd[��B+�8<����=!�P������}B��h^��XIYg0Ⱦ���>Nw��8�%Y1����� r�      +   �   x�e�Mo�0 ��3��K�H�!Y���� ٥�`��K,��������(a��w�	k��T.F�E�����l�,���L�;VY�%�P����9�5ۍS���'��WR2/�:��+-��[�ѱ�UYARǟEr��4�������^���Q��&�;���+���º�t�$��!�!��z���X�۞�K:\��5�y���I�/ < �Qg     