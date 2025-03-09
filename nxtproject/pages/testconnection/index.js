import { useState } from "react";
import { Stage, Layer, Line, Rect, Circle, Group, Text } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import Symbol1 from "../../app/components/graph/Symbol1"; //

const DiagramEditor = () => {
  const [symbols, setSymbols] = useState([
    { id: uuidv4(), type: "RECTANGLE", x: 100, y: 100, width: 80, height: 50 },
    { id: uuidv4(), type: "CIRCLE", x: 300, y: 200, width: 60, height: 60 },
    { id: uuidv4(), type: "RECTANGLE", x: 450, y: 200, width: 80, height: 50 }, // Новий прямокутник
  ]);

  const [connections, setConnections] = useState([]);
  const [isAddingConnector, setIsAddingConnector] = useState(false);
  const [selectedAnchor, setSelectedAnchor] = useState(null);
  const [hoveredAnchor, setHoveredAnchor] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [message, setMessage] = useState("");
  const [isAddingAnchor, setIsAddingAnchor] = useState(false); 

  // 🟢 Отримання точок прив'язки для елемента
  const getAnchorPoints = (element) => {
    const { x, y, width, height, type } = element;
    if (type === "RECTANGLE") {
      return [
        { x: x + width / 2, y: y, direction: "top" },
        { x: x + width / 2, y: y + height, direction: "bottom" },
        { x: x, y: y + height / 2, direction: "left" },
        { x: x + width, y: y + height / 2, direction: "right" },
      ];
    } else if (type === "CIRCLE") {
      return [
        { x: x, y: y - height / 2, direction: "top" },
        { x: x, y: y + height / 2, direction: "bottom" },
        { x: x - width / 2, y: y, direction: "left" },
        { x: x + width / 2, y: y, direction: "right" },
      ];
    }
    return [];
  };

  // 📐 Побудова маршруту 90 градусів з коректним підключенням
  const calculateOrthogonalPath = (start, end, existingAnchors = [], figureWidth = 80, figureHeight = 50) => {
 

    let { x: x1, y: y1, direction: d1 } = start;
    let { x: x2, y: y2, direction: d2 } = end;
    let points = [x1, y1];
    const offset = 20; // Базовий відступ

       // 🛑 Перевірка: Забороняємо з'єднання, якщо точки належать одній фігурі
       if (
        Math.abs(x1 - x2) <= figureWidth &&
        Math.abs(y1 - y2) <= figureHeight
    ) {
        return null;
    }

    // Динамічний бічний відступ (тільки якщо є перетин)
    const sideOffsetX = figureWidth / 2 + offset;
    const sideOffsetY = figureHeight / 2 + offset;

    let needsSideOffset = false;
    let needsVerticalOffset = false;

    if ((d1 === "top" && y2 > y1) || (d1 === "bottom" && y2 < y1)) {
        needsSideOffset = true;
    }

    if ((d1 === "left" && x2 > x1) || (d1 === "right" && x2 < x1)) {
        needsVerticalOffset = true;
    }

    // 🟢 Вихід з першої точки
    if (d1 === "left") {
        points.push(x1 - offset, y1);
        if (needsVerticalOffset) points.push(x1 - offset, y1 + sideOffsetY);
    } else if (d1 === "right") {
        points.push(x1 + offset, y1);
        if (needsVerticalOffset) points.push(x1 + offset, y1 - sideOffsetY);
    } else if (d1 === "top") {
        points.push(x1, y1 - offset);
        if (needsSideOffset) points.push(x1 + sideOffsetX, y1 - offset);
    } else if (d1 === "bottom") {
        points.push(x1, y1 + offset);
        if (needsSideOffset) points.push(x1 - sideOffsetX, y1 + offset);
    }

    let lastX = points[points.length - 2];
    let lastY = points[points.length - 1];

    // 🟢 Аналізуємо позицію другої фігури
    if (d2 === "top") {
        if (lastY > y2) {
            points.push(lastX, y2 - offset);
        } else {
            points.push(x2, lastY);
        }
    } else if (d2 === "bottom") {
        if (lastY < y2) {
            points.push(lastX, y2 + offset);
        } else {
            points.push(x2, lastY);
        }
    } else if (d2 === "left") {
        if (lastX > x2) {
            points.push(x2 - offset, lastY);
        } else {
            points.push(lastX, y2);
        }
    } else if (d2 === "right") {
        if (lastX < x2) {
            points.push(x2 + offset, lastY);
        } else {
            points.push(lastX, y2);
        }
    }

    // 🟢 Останній відступ перед кінцевою точкою
    let prevX = points[points.length - 2];
    let prevY = points[points.length - 1];

    if (!(prevX === x2 && prevY === y2)) {
        if (d2 === "left") {
            points.push(x2 - offset, y2);
        } else if (d2 === "right") {
            points.push(x2 + offset, y2);
        } else if (d2 === "top") {
            points.push(x2, y2 - offset);
        } else if (d2 === "bottom") {
            points.push(x2, y2 + offset);
        }
    }

    // 🟢 Фінальне з'єднання
    points.push(x2, y2);

    return points;
};

// 🟢 Функція для додавання нових точок прив’язки на лінії
const handleLineClick = (connectionId, event) => {
  if (!isAddingAnchor) return;

  const { x, y } = event.target.getStage().getPointerPosition();

  setConnections((prev) =>
    prev.map((conn) =>
      conn.id === connectionId
        ? {
            ...conn,
            additionalAnchors: [
              ...(conn.additionalAnchors || []),
              { id: uuidv4(), x, y, parentConnectionId: connectionId }, // ✅ Додаємо `parentConnectionId`
            ],
          }
        : conn
    )
  );

  setIsAddingAnchor(false); // Вимикаємо режим додавання після натискання
};


  // 🟢 Початок побудови лінії
  const handleAnchorClick = (anchor, connectionId = null) => {
    if (!isAddingConnector) return;
  
    console.log(`🟢 Клік по точці прив’язки або фігурі:`, anchor);
  
    if (!selectedAnchor) {
      console.log("  ✅ Вибрали початкову точку:", anchor);
      setSelectedAnchor({ ...anchor, connectionId });
      setMessage("Оберіть наступний елемент для зв'язку");
    } else {
      console.log("  🔹 Створюємо з’єднання між:", selectedAnchor, "та", anchor);
  
      const path = calculateOrthogonalPath(selectedAnchor, anchor);
  
      setConnections((prev) => {
        const newConn = {
          id: uuidv4(),
          startElementId: selectedAnchor.connectionId || selectedAnchor.id, // ✅ Додаємо `connectionId`, якщо це точка на лінії
          endElementId: anchor.id,
          startPoint: selectedAnchor,
          endPoint: anchor,
          points: path,
          additionalAnchors: prev.find((c) => c.id === connectionId)?.additionalAnchors || [], // ✅ Передаємо існуючі точки
        };
  
        console.log(`✅ Новий зв’язок додано:`, JSON.stringify(newConn, null, 2));
  
        return [...prev, newConn];
      });
  
      setSelectedAnchor(null);
      setHoveredElement(null);
      setHoveredAnchor(null);
      setMessage("");
      setIsAddingConnector(false);
    }
  };
  
  
  
  
  
  

  // 🔄 Оновлення зв'язків при перетягуванні елемента
  const handleDragMove = (id, e) => {
    const { x, y } = e.target.position();

    console.log(`🟢 Переміщуємо фігуру ${id} до позиції:`, { x, y });

    setSymbols((prev) =>
        prev.map((sym) => (sym.id === id ? { ...sym, x, y } : sym))
    );

    setConnections((prev) =>
        prev.map((conn) => {
            console.log(`🔸 Обробляємо зв’язок ${conn.id}`);
            console.log("🔍 `additionalAnchors` перед оновленням:", JSON.stringify(conn.additionalAnchors, null, 2));

            // 🔹 Шукаємо `startElement` та `endElement`
            let startElement = symbols.find((s) => s.id === conn.startElementId);
            let endElement = symbols.find((s) => s.id === conn.endElementId);

            // 🔹 Якщо `startElement` не знайдено, шукаємо `startAnchor`
            let startAnchor = conn.additionalAnchors?.find((a) => a.id === conn.startElementId);
            if (!startAnchor) {
                for (let c of prev) {
                    let foundAnchor = c.additionalAnchors?.find((a) => a.id === conn.startElementId);
                    if (foundAnchor) {
                        startAnchor = foundAnchor;
                        break;
                    }
                }
            }

            // 🔹 Якщо `endElement` не знайдено, шукаємо `endAnchor`
            let endAnchor = conn.additionalAnchors?.find((a) => a.id === conn.endElementId);
            if (!endAnchor) {
                for (let c of prev) {
                    let foundAnchor = c.additionalAnchors?.find((a) => a.id === conn.endElementId);
                    if (foundAnchor) {
                        endAnchor = foundAnchor;
                        break;
                    }
                }
            }

            console.log(`  - startElement: ${startElement ? startElement.id : "❌ НЕ знайдено"}`);
            console.log(`  - endElement: ${endElement ? endElement.id : "❌ НЕ знайдено"}`);
            console.log(`  - startAnchor: ${startAnchor ? JSON.stringify(startAnchor) : "❌ НЕ знайдено"}`);
            console.log(`  - endAnchor: ${endAnchor ? JSON.stringify(endAnchor) : "❌ НЕ знайдено"}`);

            // ❌ Якщо `startElement` або `startAnchor` НЕ знайдено – пропускаємо
            if (!startElement && !startAnchor) {
                console.warn(`❌ Пропускаємо: `, conn.id, "– `startElement` або `startAnchor` не існує!");
                return conn;
            }

            // ❌ Якщо `endElement` або `endAnchor` НЕ знайдено – пропускаємо
            if (!endElement && !endAnchor) {
                console.warn(`❌ Пропускаємо: `, conn.id, "– `endElement` або `endAnchor` не існує!");
                return conn;
            }

            // ✅ Використовуємо `startAnchor`, якщо `startElement` не знайдено
            const startPoint = startAnchor || 
                (startElement ? getAnchorPoints(startElement).find((p) => p.direction === conn.startPoint.direction) : null);

            // ✅ Використовуємо `endAnchor`, якщо `endElement` не знайдено
            const endPoint = endAnchor || 
                (endElement ? getAnchorPoints(endElement).find((p) => p.direction === conn.endPoint.direction) : null);

            console.log(`  ✅ Використовуємо startPoint:`, startPoint);
            console.log(`  ✅ Використовуємо endPoint:`, endPoint);

            if (!startPoint || !endPoint) {
                console.warn(`⚠️ Пропускаємо оновлення зв’язку ${conn.id}`);
                return conn;
            }

            // 🟢 Оновлюємо маршрут лінії
            const newPoints = calculateOrthogonalPath(startPoint, endPoint);
            console.log(`  ✅ Оновлені точки маршруту для ${conn.id}:`, newPoints);

            if (!newPoints) {
                console.warn(`⚠️ Шлях не згенерувався для зв’язку ${conn.id}`);
                return conn;
            }

            // 🟢 Оновлюємо точки прив’язки (`additionalAnchors`)
            const updatedAnchors = conn.additionalAnchors?.map((anchor) => {
                if (!anchor) return null;

                // ✅ Якщо `anchor.id` відповідає `endElementId`, прив’язуємо до фігури
                if (anchor.id === conn.endElementId && endElement?.id === id) {
                    console.log(`  🔄 Оновлюємо точку прив’язки: ${anchor.id}, переміщуємо до:`, { x, y });
                    return { ...anchor, x, y };
                }

                return anchor;
            }).filter(a => a !== null);

            console.log(`  ✅ Оновлені точки прив’язки для ${conn.id}:`, updatedAnchors);

            return {
                ...conn,
                points: newPoints,
                additionalAnchors: updatedAnchors, // ✅ Оновлені точки прив’язки
            };
        })
    );
};









  

  
  
  

  return (
    <div>
      <button onClick={() => setIsAddingConnector(true)}>Новий connector</button>
      {isAddingConnector && (
        <button onClick={() => setIsAddingConnector(false)}>Відмінити</button>
      )}

<button onClick={() => setIsAddingAnchor(true)}>Нова точка прив'язки на лінії</button>
{isAddingAnchor && <button onClick={() => setIsAddingAnchor(false)}>Відмінити</button>}

      <p>{message}</p>

      <Stage width={800} height={600} style={{ border: "1px solid black" }}>
        <Layer>
          {/* 🔗 Постійні з'єднання (чорні лінії) */}
          {connections.map((conn) => (
  <Group key={conn.id}>
    <Line
      points={[...conn.points, ...(conn.additionalAnchors || []).flatMap(a => [a.x, a.y])]}
      stroke="black"
      strokeWidth={2}
      lineJoin="round"
      onClick={(e) => handleLineClick(conn.id, e)}
    />

    {/* 🔵 Додаткові точки прив’язки на лінії */}
    {(conn.additionalAnchors || []).map((anchor) => (
      <Circle
        key={anchor.id}
        x={anchor.x}
        y={anchor.y}
        radius={6}
        fill="blue"
        stroke="black"
        strokeWidth={1}
        onClick={() => handleAnchorClick(anchor, conn.id)} // 🆕 Додаємо `connectionId`
      />
    ))}
  </Group>
))}


          {/* 🔲 Малюємо всі елементи */}
          {symbols.map((el) => (
            
            <Group
              key={el.id}
              x={el.x}
              y={el.y}
              draggable
              onDragMove={(e) => handleDragMove(el.id, e)}
              onMouseEnter={() => isAddingConnector && setHoveredElement(el.id)}
              onMouseLeave={() => isAddingConnector && setHoveredElement(null)}
            >
              {el.type === "RECTANGLE" && (
                <Rect width={el.width} height={el.height} fill="gray" stroke="black" strokeWidth={2} />
              )}
              {el.type === "CIRCLE" && (
                <Circle radius={el.width / 2} fill="gray" stroke="black" strokeWidth={2} />
              )}



              {/* 🟡 Малюємо точки прив'язки */}
              {hoveredElement === el.id &&
                getAnchorPoints(el).map((point, i) => (
                  <Circle
                    key={i}
                    x={point.x - el.x}
                    y={point.y - el.y}
                    radius={6}
                    fill={hoveredAnchor && hoveredAnchor.x === point.x && hoveredAnchor.y === point.y ? "yellow" : "green"}
                    stroke="black"
                    strokeWidth={1}
                    onMouseEnter={() => setHoveredAnchor(point)}
                    onMouseLeave={() => setHoveredAnchor(null)}
                    onClick={() => handleAnchorClick({ ...point, id: el.id })}
                  />
                ))}
                             
            </Group>
            
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DiagramEditor;