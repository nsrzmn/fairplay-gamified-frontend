import React, { useEffect, useState } from "react";
import { apiClient } from "../services/api";
import { TrendingUp, Trophy } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  player_name: string;
  score: number;
  accuracy: number;
  reaction_time_ms: number;
  game_mode: string;
  difficulty_mode: string;
  played_at: string | null;
}

interface LeaderboardData {
  mode: string;
  difficulty: string;
  days_included: number;
  leaderboard: LeaderboardEntry[];
}

const GAME_MODES = ["classic", "time_attack", "survival", "accuracy_challenge"];
const DIFFICULTIES = ["easy", "normal", "hard"];

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const query = new URLSearchParams();
        if (selectedMode !== "all") query.append("mode", selectedMode);
        if (selectedDifficulty !== "all") query.append("difficulty", selectedDifficulty);
        query.append("limit", "20");
        query.append("days", "7");

        const data = await apiClient.get<LeaderboardData>(
          `/leaderboard/global?${query.toString()}`
        );
        setLeaderboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard");
      } finally {
        setIsLoading(false);
      }
    };

    void loadLeaderboard();
  }, [selectedMode, selectedDifficulty]);

  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      classic: "Classic",
      time_attack: "Time Attack",
      survival: "Survival",
      accuracy_challenge: "Accuracy Challenge",
      all: "All Modes",
    };
    return labels[mode] || mode;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: "Easy",
      normal: "Normal",
      hard: "Hard",
      all: "All Difficulties",
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Game Mode
          </label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1f2e] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Modes</option>
            {GAME_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {getModeLabel(mode)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1f2e] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Difficulties</option>
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>
                {getDifficultyLabel(diff)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Leaderboard Table */}
      {!isLoading && leaderboardData && (
        <div className="bg-[#111827]/50 backdrop-blur border border-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1f2e]/50 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                    Player
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                    Score
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300 hidden sm:table-cell">
                    Accuracy
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300 hidden md:table-cell">
                    Avg Reaction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboardData.leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No scores found for this filter
                    </td>
                  </tr>
                ) : (
                  leaderboardData.leaderboard.map((entry, idx) => (
                    <tr
                      key={`${entry.player_name}-${idx}`}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {entry.rank <= 3 && (
                            <Trophy
                              className={`w-5 h-5 ${
                                entry.rank === 1
                                  ? "text-yellow-500"
                                  : entry.rank === 2
                                    ? "text-gray-300"
                                    : "text-orange-600"
                              }`}
                            />
                          )}
                          {entry.rank > 3 && (
                            <span className="text-gray-400 font-medium ml-1">
                              {entry.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-white truncate">
                            {entry.player_name}
                          </p>
                          <p className="text-xs text-gray-400 hidden sm:block">
                            {entry.game_mode} • {entry.difficulty_mode}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="font-semibold text-lg text-primary flex items-center justify-end gap-1 group-hover:gap-2">
                          <TrendingUp className="w-4 h-4" />
                          {entry.score}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right hidden sm:table-cell">
                        <span className="text-gray-300">
                          {entry.accuracy.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right hidden md:table-cell">
                        <span className="text-gray-300">
                          {entry.reaction_time_ms} ms
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer info */}
          <div className="px-4 py-3 bg-[#1a1f2e]/30 border-t border-white/10 text-xs text-gray-400">
            Last {leaderboardData.days_included} days •{" "}
            {selectedMode === "all" ? "All modes" : getModeLabel(selectedMode)} •{" "}
            {selectedDifficulty === "all"
              ? "All difficulties"
              : getDifficultyLabel(selectedDifficulty)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !leaderboardData && !error && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No leaderboard data available</p>
        </div>
      )}
    </div>
  );
}
