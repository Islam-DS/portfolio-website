import streamlit as st
from streamlit_option_menu import option_menu

# ---------------------------------------------------
# PAGE CONFIG
# ---------------------------------------------------

st.set_page_config(
    page_title="Mahbubul Islam",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# ---------------------------------------------------
# CUSTOM CSS
# ---------------------------------------------------

st.markdown("""
<style>

/* Entire App */
.stApp {
    background-color: #0B0F19;
    color: white;
    font-family: 'Segoe UI', sans-serif;
}

/* Hide Streamlit Branding */
#MainMenu {
    visibility: hidden;
}

footer {
    visibility: hidden;
}

header {
    visibility: hidden;
}

/* Hero Title */
.hero-title {
    font-size: 70px;
    font-weight: 700;
    margin-bottom: 10px;
    color: white;
}

/* Subtitle */
.hero-subtitle {
    font-size: 26px;
    color: #B0B3B8;
    margin-bottom: 30px;
}

/* Section Title */
.section-title {
    font-size: 42px;
    font-weight: 600;
    margin-top: 40px;
    margin-bottom: 20px;
    color: white;
}

/* Paragraph */
.section-text {
    font-size: 18px;
    color: #C5C5C5;
    line-height: 1.8;
}

</style>
""", unsafe_allow_html=True)


lottie_ai = load_lottie_url(
    "https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json"
)

# ---------------------------------------------------
# NAVIGATION MENU
# ---------------------------------------------------

selected = option_menu(
    menu_title=None,
    options=[
        "Home",
        "Education",
        "Experience",
        "Projects",
        "Research",
        "Contact"
    ],
    orientation="horizontal",
)

# ---------------------------------------------------
# HOME
# ---------------------------------------------------

if selected == "Home":

    col1, col2 = st.columns([1.3, 1])

    with col1:

        st.markdown("""
        <div style='padding-top:140px;'>

        <div class='hero-title'>
        Mahbubul Islam
        </div>

        <div class='hero-subtitle'>
        AI Researcher • Data Science Student • Machine Learning Engineer
        </div>

        <div class='section-text' style='max-width:700px;'>

        Research-focused Data Science student building
        clinically-oriented AI systems, multimodal learning pipelines,
        federated learning frameworks, and intelligent healthcare technologies.

        </div>

        </div>
        """, unsafe_allow_html=True)

    with col2:

        st_lottie(
            lottie_ai,
            height=420,
            key="ai_animation"
        )
# ---------------------------------------------------
# EDUCATION
# ---------------------------------------------------

elif selected == "Education":

    st.markdown("<div class='section-title'>Education</div>", unsafe_allow_html=True)

    st.markdown("""
    <div class='section-text'>

    • Government Laboratory High School

    <br><br>

    • BSc. in Data Science

    <br>

    Al-Farabi Kazakh National University

    <br>

    International Government Scholar

    </div>
    """, unsafe_allow_html=True)

# ---------------------------------------------------
# EXPERIENCE
# ---------------------------------------------------

elif selected == "Experience":

    st.markdown("<div class='section-title'>Work Experience</div>", unsafe_allow_html=True)

    st.markdown("""
    <div class='section-text'>

    • Research Assistant — Chronicled Laboratory

    <br><br>

    • Head of English Department — Temirlan School, Kazakhstan

    <br><br>

    • Co-Founder — Initiator Academy, Dhaka

    <br><br>

    • Group Leader — Government Laboratory High School Red Crescent Society

    <br><br>

    • Senior Volunteer Manager — English Club of the Laboratory

    </div>
    """, unsafe_allow_html=True)

# ---------------------------------------------------
# PROJECTS
# ---------------------------------------------------

elif selected == "Projects":

    st.markdown("<div class='section-title'>Projects</div>", unsafe_allow_html=True)

    st.markdown("""
    <div class='section-text'>

    GitHub-integrated AI and Data Science projects will appear here.

    </div>
    """, unsafe_allow_html=True)

# ---------------------------------------------------
# RESEARCH
# ---------------------------------------------------

elif selected == "Research":

    st.markdown("<div class='section-title'>Research Experience</div>", unsafe_allow_html=True)

    st.markdown("""
    <div class='section-text'>

    Publications, conference papers, and research work will appear here.

    </div>
    """, unsafe_allow_html=True)

# ---------------------------------------------------
# CONTACT
# ---------------------------------------------------

elif selected == "Contact":

    st.markdown("<div class='section-title'>Contact</div>", unsafe_allow_html=True)

    st.markdown("""
    <div class='section-text'>

    LinkedIn

    <br><br>

    GitHub

    <br><br>

    Email

    <br><br>

    WhatsApp

    </div>
    """, unsafe_allow_html=True)