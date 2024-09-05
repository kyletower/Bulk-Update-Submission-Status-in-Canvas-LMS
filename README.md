# Bulk-Update-Submission-Status-in-Canvas-LMS

This code will allow an instructor to bulk update the submission status of an assignment (i.e. none, late, missing). I use this to remove late penalties from assignments submitted within the first two weeks of the course.

## Option 1: Python – `app.py`

This method will gather all the assignments that are marked as late and submitted prior to a specified cutoff date. It seems to run slower than Option 2 but since it automatically gathers all the assignments from the Canvas API it's my preferred method.

1. Create a virtual environment named `canvas` using `venv`.

```bash
python3 -m venv canvas
```

2. Install the requirements.

```bash
pip install -r requirements.txt
```

3. Rename `.env.sample` to `.env`.

4. Update the values for `.env`.

5. Run `app.py`.

```bash
python3 app.py
```

## Option 2: Node – `app.js`

This method will currently only handle one assignment at a time. It should be refactored to handle a list of assignments. Even better, it should be refactored to find a list of assignments that are marked as late and have been submitted prior to a specified cutoff date.

1. Install the dependencies.

```bash
npm install
```

2. Modify the `app.js` to the assignment that you want to remove late penalties.

3. Run `app.js`

```bash
node app.js
```
