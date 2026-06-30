import sys
path = sys.argv[1] if len(sys.argv) > 1 else r'd:\Projects\ignitia2k26\src\components\atomquest\GoalSheetEditor.tsx'
text = open(path, encoding='utf-8').read()
text = text.replace('<motion.div', '<div')
text = text.replace('</motion.div>', '</div>')
open(path, 'w', encoding='utf-8').write(text)
print('fixed')
