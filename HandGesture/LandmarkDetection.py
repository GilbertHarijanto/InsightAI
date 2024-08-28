import cv2
import mediapipe as mp
import time
import HandTrackingModule as htm
pTime = 0
cTime = 0
detector = htm.handDetector(detectionCon=0.75)
gesture_times = {
    "next": 0,
    "prev": 0,
    "question": 0,
    "note": 0,
    "capture": 0
}


def check_next(lmList):
    # Ensure thumb is not between thumb base and pinky base and check other fingers are curled
    if not (lmList[3][1] < lmList[4][1] < lmList[17][1] or lmList[17][1] < lmList[4][1] < lmList[3][1]):
        if all(lmList[4][1] < lmList[i][1] for i in [8, 12, 16, 20]) and \
           all(lmList[i][2] > lmList[i-3][2] for i in [8, 12, 16, 20]):
            return True
    return False


def check_prev(lmList):
    # Ensure thumb is not between thumb base and pinky base reversed and check other fingers are curled
    if not (lmList[3][1] > lmList[4][1] > lmList[17][1] or lmList[17][1] > lmList[4][1] > lmList[3][1]):
        if all(lmList[4][1] > lmList[i][1] for i in [8, 12, 16, 20]) and \
           all(lmList[i][2] > lmList[i-3][2] for i in [8, 12, 16, 20]):
            return True
    return False


def check_question(lmList):
    # Check if the index finger is the highest point (lowest y-coordinate) and pointing upward
    if lmList[8][2] < lmList[6][2] and all(lmList[8][2] < lmList[i][2] for i in [4, 12, 16, 20]):
        # Ensure other fingers (including the thumb) are not pointing upward
        # Their tip y-coordinates should be greater than their proximal joint y-coordinates
        if all(lmList[i][2] > lmList[i-3][2] for i in [12, 16, 20]):
            return True
    return False


def check_note(lmList):
    # Check specific finger tips are higher than their adjacent joints
    if (lmList[6][2] < lmList[7][2] and lmList[6][2] < lmList[5][2] and
        lmList[12][2] < lmList[11][2] and lmList[12][2] < lmList[10][2] and
        lmList[16][2] < lmList[15][2] and lmList[16][2] < lmList[14][2] and
            lmList[20][2] < lmList[19][2] and lmList[20][2] < lmList[18][2]):
        return True
    return False


def check_capture(lmList):
    # Fist gesture check if thumb is between the index PIP and pinky MCP
    if (lmList[7][1] < lmList[4][1] < lmList[19][1] or lmList[19][1] < lmList[4][1] < lmList[7][1]) and \
       all(lmList[i][2] > lmList[i-3][2] for i in [8, 12, 16, 20]):
        return True
    return False


cap = cv2.VideoCapture(0)

while True:
    success, img = cap.read()
    img = detector.findHands(img, draw=True)
    lmList = detector.findPosition(img, draw=True)
    if len(lmList) != 0:
        if check_next(lmList):
            print("Next gesture detected")

        elif check_prev(lmList):
            print("Previous gesture detected")

        elif check_question(lmList):
            print("Question gesture detected")

        elif check_note(lmList):
            print("Note gesture detected")

        elif check_capture(lmList):
            print("Capture gesture detected")

        else:
            print(lmList)
    if lmList:
        current_time = time.time()
        gestures = {
            "next": check_next(lmList),
            "prev": check_prev(lmList),
            "question": check_question(lmList),
            "note": check_note(lmList),
            "capture": check_capture(lmList)
        }

        for gesture, detected in gestures.items():
            if detected:
                if gesture_times[gesture] == 0:
                    gesture_times[gesture] = current_time
                elif current_time - gesture_times[gesture] >= 2:
                    print(f"{gesture.capitalize()} gesture held for 2 seconds.")
                    gesture_times[gesture] = 0
            else:
                gesture_times[gesture] = 0

    cTime = time.time()

    fps = 1 / (cTime - pTime)
    pTime = cTime

    cv2.imshow("Image", img)
    cv2.waitKey(1)
