import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface SimpleCardProps {
  title: string;
  tags: string[];
  content: string;
  style?: any;
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  title,
  tags,
  content,
  style,
}) => {
  const theme = useTheme();

  return (
    <ThemedView 
    style={[styles.container, style]}
    >
      <Card 
        mode='contained'
        style={[
          { backgroundColor: theme.colors.surface },
           styles.card]}
           >
        <Card.Title 
          title={title} 
          titleStyle={[styles.cardTitle, { color: theme.colors.onSurface }]}
          subtitle={tags && tags.length? tags.join(' '): content} 
          subtitleStyle={[styles.cardSubtitle, { color: theme.colors.onSurfaceVariant }]}
        />
        <Card.Content>
          <ThemedText 
          style={[styles.cardContent, { color: theme.colors.onSurface }]}
          >
            {content}
          </ThemedText>
        </Card.Content>
      </Card>
    </ThemedView>
  );
};

const CARD_BORDER_RADIUS = 4;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  card: {
    borderRadius: CARD_BORDER_RADIUS,
    borderWidth:0,
    backgroundColor: '#fff'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 24,
    marginVertical: 10,
  }
});

export default SimpleCard;