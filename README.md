# Bulk-Update-Submission-Status-in-Canvas-LMS

This code will allow an instructor to bulk update the submission status of an assignment (i.e. none, late, missing). I use this to remove late penalties from assignments submitted within the first two weeks of the course.

## Option 1: `app.py`

1. Create a virtual environment named `canvas` using `venv`

```bash
python3 -m venv canvas
```

2. Install the requirements

```bash
pip install -r requirements.txt
```

3. Rename `.env.sample` to `.env`

4. Update the values for `.env`

5. Run `app.py`

```bash
python3 app.py
```
