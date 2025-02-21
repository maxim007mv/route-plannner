#include <emscripten/bind.h>
#include <vector>
#include <cmath>
#include <algorithm>
#include <string>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <emscripten/emscripten.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

using namespace emscripten;

class RouteCalculator {
public:
    // Структуры данных
    struct Point {
        double lat;
        double lng;
    };

    struct RouteSegment {
        Point start;
        Point end;
        double distance;
        double time;
    };

    struct RouteStats {
        double totalDistance;
        double totalTime;
        double averageSpeed;
        std::vector<RouteSegment> segments;
    };

    // Основные методы
    double toRadians(double degrees) {
        return degrees * M_PI / 180.0;
    }

    double calculateDistance(Point p1, Point p2) {
        const double R = 6371.0; // Радиус Земли в км

        double lat1 = toRadians(p1.lat);
        double lat2 = toRadians(p2.lat);
        double dLat = toRadians(p2.lat - p1.lat);
        double dLon = toRadians(p2.lng - p1.lng);

        double a = sin(dLat/2) * sin(dLat/2) +
                  cos(lat1) * cos(lat2) *
                  sin(dLon/2) * sin(dLon/2);

        double c = 2 * atan2(sqrt(a), sqrt(1-a));
        return R * c;
    }

    // Расчет оптимального маршрута
    std::vector<Point> optimizeRoute(const std::vector<Point>& points) {
        std::vector<Point> optimized = points;
        std::vector<bool> visited(points.size(), false);
        std::vector<Point> result;
        result.reserve(points.size());

        // Начинаем с первой точки
        Point current = points[0];
        result.push_back(current);
        visited[0] = true;

        // Для каждой следующей точки находим ближайшую непосещенную
        for (size_t i = 1; i < points.size(); ++i) {
            double minDist = 1e9;
            size_t nextIndex = 0;

            for (size_t j = 0; j < points.size(); ++j) {
                if (!visited[j]) {
                    double dist = calculateDistance(current, points[j]);
                    if (dist < minDist) {
                        minDist = dist;
                        nextIndex = j;
                    }
                }
            }

            current = points[nextIndex];
            result.push_back(current);
            visited[nextIndex] = true;
        }

        return result;
    }

    // Расчет статистики маршрута
    RouteStats calculateRouteStats(const std::vector<Point>& points) {
        RouteStats stats;
        stats.totalDistance = 0.0;
        stats.totalTime = 0.0;
        const double avgWalkingSpeed = 5.0; // км/ч

        for (size_t i = 0; i < points.size() - 1; ++i) {
            RouteSegment segment;
            segment.start = points[i];
            segment.end = points[i + 1];
            segment.distance = calculateDistance(points[i], points[i + 1]);
            segment.time = segment.distance / avgWalkingSpeed;

            stats.segments.push_back(segment);
            stats.totalDistance += segment.distance;
            stats.totalTime += segment.time;
        }

        stats.averageSpeed = stats.totalDistance / stats.totalTime;
        return stats;
    }

    // Поиск ближайших точек интереса
    std::vector<Point> findNearestPoints(Point location, const std::vector<Point>& points, double maxDistance) {
        std::vector<Point> nearest;
        for (const auto& p : points) {
            if (calculateDistance(location, p) <= maxDistance) {
                nearest.push_back(p);
            }
        }
        return nearest;
    }
};

// Привязка методов к JavaScript
EMSCRIPTEN_BINDINGS(route_calculator) {
    class_<RouteCalculator>("RouteCalculator")
        .constructor<>()
        .function("calculateDistance", &RouteCalculator::calculateDistance)
        .function("optimizeRoute", &RouteCalculator::optimizeRoute)
        .function("calculateRouteStats", &RouteCalculator::calculateRouteStats)
        .function("findNearestPoints", &RouteCalculator::findNearestPoints);

    value_object<RouteCalculator::Point>("Point")
        .field("lat", &RouteCalculator::Point::lat)
        .field("lng", &RouteCalculator::Point::lng);

    value_object<RouteCalculator::RouteSegment>("RouteSegment")
        .field("start", &RouteCalculator::RouteSegment::start)
        .field("end", &RouteCalculator::RouteSegment::end)
        .field("distance", &RouteCalculator::RouteSegment::distance)
        .field("time", &RouteCalculator::RouteSegment::time);

    value_object<RouteCalculator::RouteStats>("RouteStats")
        .field("totalDistance", &RouteCalculator::RouteStats::totalDistance)
        .field("totalTime", &RouteCalculator::RouteStats::totalTime)
        .field("averageSpeed", &RouteCalculator::RouteStats::averageSpeed)
        .field("segments", &RouteCalculator::RouteStats::segments);

    register_vector<RouteCalculator::Point>("VectorPoint");
    register_vector<RouteCalculator::RouteSegment>("VectorSegment");
}
